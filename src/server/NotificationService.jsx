import { collection, getDoc, getDocs, query, where, doc, onSnapshot, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config/FirebaseConfig";
import { convertTimeStampToDate, convertTimeStampToDateAdvertCard, convertTimeStampToDateChat } from "./UtilsService";

export const getUserNotifications = async () => {
    const notificationRef = collection(db, "notifications");
    const q = query(notificationRef, where("to", "==", auth.currentUser.uid));
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
        isActive: true,
        sentAt: message.sentAt,
        to: receiverId,
    });
};

export const sendForumNotification = async (topicId, comment, responseId) => {
    const topicRef = doc(db, "topic", topicId);
    const topic = await getDoc(topicRef);
    const receiverId = topic.data().createdBy;

    const responseRef = doc(db, "topicComments", responseId);
    const response = await getDoc(responseRef);
    const senderId = response.data().createdBy;
    
    if(senderId === receiverId) 
    return;
    const notificationRef = collection(db, "notifications");
    await addDoc(notificationRef, {
        content: comment,
        from: senderId,
        isActive: true,
        sentAt: serverTimestamp(),
        to: receiverId
    });
};