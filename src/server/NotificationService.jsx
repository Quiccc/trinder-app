import { collection, getDoc, getDocs, query, where, doc, addDoc, serverTimestamp, orderBy, limit, updateDoc } from "firebase/firestore";
import { auth, db } from "./config/FirebaseConfig";
import { convertTimeStampToDate, convertTimeStampToDateAdvertCard, convertTimeStampToDateChat } from "./UtilsService";
import { getUserNameById } from "./UserService"
import { getTopicById, getCommentById} from "./ForumService";

export const getActiveUserNotifications = async () => {
    const notificationRef = collection(db, "notifications");
    const q = query(notificationRef, where("to", "==", auth.currentUser.uid), where("isActive", "==", true), orderBy("sentAt", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    let notifications = [];
    for(let i = 0; i < querySnapshot.docs.length; i++){
        let notification = querySnapshot.docs[i].data();
        notification.id = querySnapshot.docs[i].id;
        notifications.push(notification);
    }
    return notifications
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
    });
};

export const deactivateNotification = async (notificationId) => {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
        isActive: false,
    });
};