import { collection, getDoc, getDocs, query, where, doc, onSnapshot, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config/FirebaseConfig";
import { convertTimeStampToDate, convertTimeStampToDateAdvertCard, convertTimeStampToDateChat } from "./UtilsService";


export const getChatUsers = async () => {
    //Get data from chats table advertOwnerId or messagerId is equal to current user id
    const chatRef = collection(db, "chats");
    const q = query(chatRef, where("advertOwnerId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    let chatUsers = [];
    for(let i = 0; i < querySnapshot.docs.length; i++){
        let otherUserId = querySnapshot.docs[i].data().advertOwnerId === auth.currentUser.uid ? querySnapshot.docs[i].data().messagerId : querySnapshot.docs[i].data().advertOwnerId;
        let userRef = doc(db, "user", otherUserId);
        await getDoc(userRef).then((document) => {
            let user = document.data();
            user.id = document.id;
            user.chatsId = querySnapshot.docs[i].id;
            chatUsers.push(user);
        });
    }

    const q2 = query(chatRef, where("messagerId", "==", auth.currentUser.uid));
    const querySnapshot2 = await getDocs(q2);
    for(let i = 0; i < querySnapshot2.docs.length; i++){
        let otherUserId = querySnapshot2.docs[i].data().advertOwnerId === auth.currentUser.uid ? querySnapshot2.docs[i].data().messagerId : querySnapshot2.docs[i].data().advertOwnerId;
        let userRef = doc(db, "user", otherUserId);
        await getDoc(userRef).then((document) => {
            let user = document.data();
            user.id = document.id;
            user.chatsId = querySnapshot2.docs[i].id;
            chatUsers.push(user);
        });
    }
    return chatUsers;
};

export const getChatMessages = async (chatId) => {
    //Get chat document with chatId
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    let messages = chatDoc.data().messages;
    for(let i = 0; i < messages.length; i++){
        let message = messages[i];
        message.sentDay = convertTimeStampToDateAdvertCard(message.sentAt);
        message.sentAt = convertTimeStampToDateChat(message.sentAt);
        messages[i] = message;
    }
    //Get advert with advertId
    const advertRef = doc(db, "adverts", chatDoc.data().advertId);
    const advertDoc = await getDoc(advertRef);
    let advert = advertDoc.data();
    advert.advert_id = advertDoc.id;
    advert.createdAt = convertTimeStampToDate(advert.created_at);
    advert.type = advert.type === "buyer" ? "Model Request" : advert.type === "service" ? "Sell Service" : "Sell Product";
    //Get messages from messages table with chatId
    return {
        messages: messages,
        advert: advert
    };
};

export const sendMessage = async (chatId, message) => {
    //Get chat document with chatId
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    //Get messages from messages table with chatId
    let messages = chatDoc.data().messages;
    message.sentAt = new Date();
    messages.push(message);
    
    //Update messages in messages table with chatId
    await updateDoc(chatRef, {
        messages: messages
    });
};

export const subscribeToChat = (chatId, callback) => {
    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        let newMessages = snapshot.data().messages || [];
        if(newMessages.length > 0){
            for(let i = 0; i < newMessages.length; i++){
                newMessages[i].sentAt = convertTimeStampToDateChat(newMessages[i].sentAt);
            }
        }
        callback(newMessages);
      }
    });
  
    return unsubscribe;
  };
  
export const createContact = async (advertId) => {
    //Get advert document with advertId
    const advertRef = doc(db, "adverts", advertId);
    const advert = await getDoc(advertRef);
    const advertOwnerId = advert.data().user_id;
    
    //If there is document between current user and advert owner return that document id, else create new document

    const q = query(collection(db, "chats"), where("advertOwnerId", "==", advertOwnerId), where("advertId", "==", advertId), where("messagerId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.docs.length > 0){
        return querySnapshot.docs[0].id;
    }else {
        const newChatRef = collection(db, "chats");
        //Create a new dow in chat await addDoc(collection(db, "adverts"), {
        await addDoc(newChatRef, {
            advertId: advertId,
            advertOwnerId: advertOwnerId,
            messagerId: auth.currentUser.uid,
            messages: []
        });
        return newChatRef.id;
    }
};

export const sendReport = async (chatId, reportText, reportedUser) => {
    const reportRef = collection(db, "reports");
    if(reportedUser === 0){
        await addDoc(reportRef, {
            userId: chatId.data().messagerId,
            senderID: auth.currentUser.uid,
            reportText: reportText,
            reportFrom: "user",
            createdAt: serverTimestamp(),
            isActive: true
        });
    }
    else
    await addDoc(reportRef, {
        userId: chatId.data().advertOwnerId,
        senderID: auth.currentUser.uid,
        reportText: reportText,
        reportFrom: "user",
        createdAt: serverTimestamp(),
        isActive: true
    });
};