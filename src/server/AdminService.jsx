import { collection, doc, getCountFromServer, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./config/FirebaseConfig";
import { getFunctions, httpsCallable } from "firebase/functions";

export const getReportsFromForum = async () => {
    const reportRef = collection(db, 'reports');
    const q = query(reportRef, where('reportFrom', '==', 'forum'), where('isActive', '==', true), orderBy('createdAt', 'desc'));
    const reportSnapshot = await getDocs(q);
    let reportList = [];
    for (let i = 0; i < reportSnapshot.docs.length; i++) {
        let report = reportSnapshot.docs[i].data();
        report.id = reportSnapshot.docs[i].id;
        const commentRef = doc(db, 'topicComments', report.commentId);
        const commentSnapshot = await getDoc(commentRef);
        report.comment = commentSnapshot.data();

        const userRef = doc(db, 'user', report.comment.createdBy);
        const userSnapshot = await getDoc(userRef);
        report.user = userSnapshot.data();
        reportList.push(report);
    }
    return reportList;
};

export const getReportsFromAdvert = async () => {
    const reportRef = collection(db, 'reports');
    const q = query(reportRef, where('reportFrom', '==', 'advert'), where('isActive', '==', true), orderBy('createdAt', 'desc'));
    const reportSnapshot = await getDocs(q);
    let reportList = [];
    for (let i = 0; i < reportSnapshot.docs.length; i++) {
        let report = reportSnapshot.docs[i].data();
        report.id = reportSnapshot.docs[i].id;
        const advertRef = doc(db, 'adverts', report.advertID);
        const advertSnapshot = await getDoc(advertRef);
        report.user_id = advertSnapshot.data().user_id;
        reportList.push(report);
    }
    return reportList;
};

export const getReportsFromChat = async () => {
    const reportRef = collection(db, 'reports');
    const q = query(reportRef, where('reportFrom', '==', 'user'), where('isActive', '==', true), orderBy('createdAt', 'desc'));
    const reportSnapshot = await getDocs(q);
    let reportList = [];
    for (let i = 0; i < reportSnapshot.docs.length; i++) {
        let report = reportSnapshot.docs[i].data();
        report.id = reportSnapshot.docs[i].id;

        const userRef = doc(db, 'user', report.userId);
        const userSnapshot = await getDoc(userRef);

        const chatRef = doc(db, 'chats', report.chatId);
        const chatSnapshot = await getDoc(chatRef);

        report.user = userSnapshot.data();
        report.chat = chatSnapshot.data();
        report.chat.messages = report.chat.messages.filter(message => message.senderId !== report.senderID);
        reportList.push(report);
    };
    return reportList;
};

export const getUsersForAdmin = async () => {
    const usersRef = collection(db, 'user');
    const q = query(usersRef, where('isAdmin', '==', false));
    const usersSnapshot = await getDocs(q);
    let userList = [];
    for (let i = 0; i < usersSnapshot.docs.length; i++) {
        let user = usersSnapshot.docs[i].data();
        user.id = usersSnapshot.docs[i].id;
        userList.push(user);
    }
    return userList;
};

export const getAdvertsForAdmin = async () => {
    const advertsRef = collection(db, 'adverts');
    const q = query(advertsRef, orderBy('created_at', 'desc'));
    const advertsSnapshot = await getDocs(q);
    let advertList = [];
    for (let i = 0; i < advertsSnapshot.docs.length; i++) {
        let advert = advertsSnapshot.docs[i].data();
        advert.id = advertsSnapshot.docs[i].id;
        const userRef = doc(db, 'user', advert.user_id);
        const userSnapshot = await getDoc(userRef);
        advert.userName = userSnapshot.data().name + ' ' + userSnapshot.data().surname;
        advertList.push(advert);
    }
    return advertList;
};

export const getReportsCount = async () => {
    //How many are from forum, advert, user
    const reportRef = collection(db, 'reports');
    const qForum = query(reportRef, where('reportFrom', '==', 'forum'), where('isActive', '==', true));
    const qAdvert = query(reportRef, where('reportFrom', '==', 'advert'), where('isActive', '==', true));
    const qUser = query(reportRef, where('reportFrom', '==', 'user'), where('isActive', '==', true));

    const forumRef = await getCountFromServer(qForum);
    const forumCount = forumRef.data().count;
    const advertRef = await getCountFromServer(qAdvert);
    const advertCount = advertRef.data().count;
    const userRef = await getCountFromServer(qUser);
    const userCount = userRef.data().count;

    return { forumCount: forumCount, advertCount: advertCount, userCount: userCount };
};

export const deleteAdvert = async (advertId) => {
    console.log(advertId);
    const functions = getFunctions();
    const deleteAdvert = httpsCallable(functions, "deleteAdvert");
    let result = await deleteAdvert({ advertId: advertId });
    return result;
};

export const banUser = async (userId) => {
    console.log(userId);
    const functions = getFunctions();
    const disableUser = httpsCallable(functions, "disableUser");
    let result = await disableUser({ uid: userId });
    return result;
};

export const sendWarning = async (userId) => {
    //Send notification with userId, and maybe text content

};

export const deleteComment = async (commentId) => {
    console.log(commentId);
    const functions = getFunctions();
    const deleteComment = httpsCallable(functions, "deleteComment");
    let result = await deleteComment({ commentId: commentId });
    return result;
};

export const deleteReport = async (reportId) => {
    console.log(reportId);
    const functions = getFunctions();
    const deleteReport = httpsCallable(functions, "deleteReport");
    let result = await deleteReport({ reportId: reportId });
    return result;
};