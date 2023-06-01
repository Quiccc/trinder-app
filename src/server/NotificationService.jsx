import { collection, getDoc, getDocs, query, where, doc, addDoc, serverTimestamp, orderBy, limit, deleteDoc } from "firebase/firestore";
import { auth, db } from "./config/FirebaseConfig";
import { getUserNameById } from "./UserService"
import { getTopicById, getCommentById} from "./ForumService";

export const getActiveUserNotifications = async () => {
    const notificationRef = collection(db, "notifications");
    const q = query(notificationRef, where("to", "==", auth.currentUser.uid), orderBy("sentAt", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    let notifications = [];
    for(let i = 0; i < querySnapshot.docs.length; i++){
        let notification = querySnapshot.docs[i].data();
        notification.id = querySnapshot.docs[i].id;
        notifications.push(notification);
    }
    return notifications;
};

export const sendChatNotification = async (chatId, message) => {
    const chatRef = doc(db, "chats", chatId);
    const chat = await getDoc(chatRef);
    let receiverId;
    if (chat.data().advertOwnerId === auth.currentUser.uid) 
    receiverId = chat.data().messagerId;

    else
    receiverId = chat.data().advertOwnerId;
    
    const notificationRef = collection(db, "notifications");
    await addDoc(notificationRef, {
        content: message.message,
        from: auth.currentUser.uid,
        senderName: await getUserNameById(auth.currentUser.uid),
        isActive: true,
        sentAt: message.sentAt,
        to: receiverId,
        type: "chat",
        chatId: chatId,
    });
};

export const sendForumNotification = async (topicId, comment, responseId) => {
    const topic = await getTopicById(topicId);
    const receiverId = topic.createdBy;

    const response = await getCommentById(responseId);
    const senderId = response.createdBy;
     
    if(senderId === receiverId) 
    return;
    const notificationRef = collection(db, "notifications");
    await addDoc(notificationRef, {
        topicHeader: topic.topicHeader,
        content: comment,
        from: senderId,
        senderName: await getUserNameById(senderId),
        isActive: true,
        sentAt: serverTimestamp(),
        to: receiverId,
        type: "forum",
        topicId: topicId,
    });
};

export const sendWarningAdvertReportNotification = async (advertId,userId) => {
    const advertRef = await getDoc(doc(db, "adverts", advertId));
    const advert = advertRef.data();
    const advertTitle = advert.title;
    const notificationRef = collection(db, "notifications");
    await addDoc(notificationRef, {
        isActive: true,
        type: "warningAdvertReport",
        sentAt: serverTimestamp(),
        to: userId,
        content: `You have been warned for inappropriate advert: ${advertTitle}. If you continue to send inappropriate adverts, your account will be banned.`,
    });
}

export const sendWarningChatReportNotification = async (userId) => {
    const notificationRef = collection(db, "notifications");
    await addDoc(notificationRef, {
        isActive: true,
        type: "warningChatReport",
        sentAt: serverTimestamp(),
        to: userId,
        content: "You have been warned for inappropriate chat message. If you continue to send inappropriate messages, your account will be banned.",
    });
}

export const sendWarningForumReportNotification = async (userId) => {
    const notificationRef = collection(db, "notifications");
    await addDoc(notificationRef, {
        isActive: true,
        type: "warningForumReport",
        sentAt: serverTimestamp(),
        to: userId,
        content: "You have been warned for inappropriate forum comment. If you continue to send inappropriate comments, your account will be banned.",
    });
}

export const deactivateNotification = async (notificationId) => {
    console.log(notificationId);
    const notificationRef = doc(db, "notifications", notificationId);
    await deleteDoc(notificationRef);
};