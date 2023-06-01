import { addDoc, collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, serverTimestamp, startAfter, updateDoc, where } from "firebase/firestore";
import { auth, db } from "./config/FirebaseConfig";
import algoliasearch from 'algoliasearch/lite';
import { convertTimeStampToDateForumComment } from "./UtilsService";
const algoliaClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_SEARCH_KEY);
const indexTopicComments = algoliaClient.initIndex('topicComments');

export const getTopicCategories = async () => {
    //Get topic categories from firestore topicCategory collection
    //Return array of topic categories
    const topicCategoryRef = collection(db, 'topicCategory');
    const topicCategorySnapshot = await getDocs(topicCategoryRef);
    const topicCategoryList = [];
    for (let i = 0; i < topicCategorySnapshot.docs.length; i++) {
        const topicCategory = {
            id: topicCategorySnapshot.docs[i].data().order,
            title: topicCategorySnapshot.docs[i].data().topicHeader,
            active: topicCategorySnapshot.docs[i].data().order === 1 ? false : false,
            isCategory: true,
            categoryId: topicCategorySnapshot.docs[i].id,
        };
        topicCategoryList.push(topicCategory);
    }
    //Sort by order
    topicCategoryList.sort((a, b) => a.id - b.id);
    // topicCategoryList.push({
    //     id: 4,
    //     title: 'My Posts',
    //     active: false,
    //     isCategory: false,
    // });
    // topicCategoryList.push({
    //     id: 5,
    //     title: 'My Comments',
    //     active: false,
    //     isCategory: false,
    // });
    // topicCategoryList.push({
    //     id: 6,
    //     title: 'My Likes',
    //     active: false,
    //     isCategory: false,
    // });
    return topicCategoryList;
};

export const getTopicsByCategoryId = async (categoryId,pageNumber,pageSize,lastIndexId) => {
    //Get topics from firestore topic collection
    //Return array of topics
    const topicRef = collection(db, 'topic');
    let q = query(topicRef, where('topicCategoryId', '==', categoryId), where('isActive', '==', true));
    let qCopy = q;
    if(pageNumber !== 0){
        let lastIndexDoc = await getDoc(doc(db, 'topic', lastIndexId));
        q = query(q, orderBy('createdAt', 'desc'), limit(pageSize), startAfter(lastIndexDoc));
    }else{
        q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));
    }
    const topicSnapshot = await getDocs(q);
    let topicList = [];
    for (let i = 0; i < topicSnapshot.docs.length; i++) {
        topicList.push(topicSnapshot.docs[i].data());
        //Set date to date string, createdAt is a timestamp
        topicList[i].createdAt = new Date(topicList[i].createdAt.seconds * 1000).toLocaleDateString();
        topicList[i].id = topicSnapshot.docs[i].id;
        //Get comments count from firestore topicComment collection by topicId
        const topicCommentRef = collection(db, 'topicComments');
        const q = query(topicCommentRef, where('topicId', '==', topicList[i].id), where('isActive', '==', true));
        const snapshot = await getCountFromServer(q);
        topicList[i].commentsCount = snapshot.data().count;
        topicList[i].likesCount = topicList[i].likedBy.length
        topicList[i].unlikesCount = topicList[i].unlikedBy.length;
    }

    //Get all count by using topicRef with query
    const allCountSnapshot = await getCountFromServer(qCopy);
    const count = allCountSnapshot.data().count;
    return {topicList,count};
};

export const getTopicCommentsByTopicId = async (topicId,pageNumber,pageSize,lastIndexId) => {
    //Get topic comments from firestore topicComment collection
    //Return array of topic comments
    const topicCommentRef = collection(db, 'topicComments');
    let q = query(topicCommentRef, where('topicId', '==', topicId), where('isActive', '==', true));
    let qCopy = q;
    if(pageNumber !== 0){
        let lastIndexDoc = await getDoc(doc(db, 'topicComments', lastIndexId));
        q = query(q, orderBy('createdAt', 'asc'), limit(pageSize), startAfter(lastIndexDoc));
    }else{
        q = query(q, orderBy('createdAt', 'asc'), limit(pageSize));
    }    
    const topicCommentSnapshot = await getDocs(q);
    let topicCommentList = [];
    for (let i = 0; i < topicCommentSnapshot.docs.length; i++) {
        topicCommentList.push(topicCommentSnapshot.docs[i].data());
        //Set date to date string, createdAt is a timestamp
        topicCommentList[i].createdAt = convertTimeStampToDateForumComment(topicCommentList[i].createdAt);
        topicCommentList[i].id = topicCommentSnapshot.docs[i].id;
        //Get user info from firestore user collection by createdBy
        const userRef = doc(db, 'user', topicCommentList[i].createdBy);
        const userSnapshot = await getDoc(userRef);
        topicCommentList[i].user = userSnapshot.data();
    }

    const allCountSnapshot = await getCountFromServer(qCopy);
    const count = allCountSnapshot.data().count;
    return {topicCommentList,count};
};  

export const sendReportForum = async (comment,reportText) => {
    const reportRef = collection(db, 'reports');
    let report = await addDoc(reportRef, {
        reportFrom: "forum",
        reportText: reportText,
        commentId: comment.id,
        senderId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        isActive: true
    });
    return report;
};

export const sendLikeUnlikeTopic = async (topicId, likeStatus) => {
    //Get topic
    //If likeStatus is true, add auth.currentUser.uid to likedBy array
    //If likeStatus is false, remove auth.currentUser.uid from likedBy array and add to unlikedBy array, vice versa
    const topicRef = doc(db, 'topic', topicId);
    const topicSnapshot = await getDoc(topicRef);
    let topic = topicSnapshot.data();
    if (likeStatus) {
        topic.likedBy.push(auth.currentUser.uid);
        topic.unlikedBy = topic.unlikedBy.filter((item) => item !== auth.currentUser.uid);
    } else {
        topic.unlikedBy.push(auth.currentUser.uid);
        topic.likedBy = topic.likedBy.filter((item) => item !== auth.currentUser.uid);
    }
    await updateDoc(topicRef, {
        likedBy: topic.likedBy,
        unlikedBy: topic.unlikedBy,
    });
    return topic;
};

export const createComment = async (topicID, sanitizedContent) => {
    //Create new comment
    const topicCommentRef = collection(db, 'topicComments');
    let comment = await addDoc(topicCommentRef, {
        topicId: topicID,
        comment: sanitizedContent,
        isActive: true,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
    });
    return comment;
};

export const createTopic = async (comment, topicHeader,topicCategoryId) => {
    const topicRef = collection(db, 'topic');
    let topic = await addDoc(topicRef, {
        topicHeader: topicHeader,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        isActive: true,
        isLocked: false,
        likedBy: [],
        unlikedBy: [],
        topicCategoryId: topicCategoryId,
    });

    const topicCommentRef = collection(db, 'topicComments');
    let topicComment = await addDoc(topicCommentRef, {
        topicId: topic.id,
        comment: comment,
        isActive: true,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
    });

    return (topicComment, topic);
};

export const getIsTopicLocked = async (topicId) => {
    //Get topic from firestore topic collection by topicId
    //Return isLocked
    const topicRef = doc(db, 'topic', topicId);
    const topicSnapshot = await getDoc(topicRef);
    return topicSnapshot.data().isLocked;
};

export const getTopicsByText = async (text,pageNumber,pageSize) => {

    //Use algolia to search for topics, we are searching topicComments collection, distinctBy topicId and return topicIds
    let params = {
        page: pageNumber,
        hitsPerPage: pageSize,
    };  
    const searchResult = await indexTopicComments.search(text, params);
    const count = searchResult.nbHits;
    const topicIds = searchResult.hits.map((item) => item.topicId);

    const topicRef = collection(db, 'topic');
    const q = query(topicRef, where('isActive', '==', true), where('__name__', 'in', topicIds));
    const topicSnapshot = await getDocs(q);
    let topicList = [];
    for (let i = 0; i < topicSnapshot.docs.length; i++) {
        let topic = topicSnapshot.docs[i].data();
        topic.id = topicSnapshot.docs[i].id;
        topic.createdAt = new Date(topic.createdAt.seconds * 1000).toLocaleDateString();
        const topicCommentsRef = collection(db, 'topicComments');
        const topicCommentsSnapshot = await getDocs(query(topicCommentsRef, where('topicId', '==', topic.id)));
        topic.commentCount = topicCommentsSnapshot.docs.length;
        topic.likesCount = topic.likedBy.length;
        topic.unlikesCount = topic.unlikedBy.length;
        topicList.push(topic);
    }
    
    return {
        topicList,
        count: count,
    }
};

export const getTopicById = async (topicId) => {
    const topicRef = doc(db, 'topic', topicId);
    const topic = await getDoc(topicRef);
    return topic.data();
};

export const getCommentById = async (commentId) => {
    const commentRef = doc(db, 'topicComments', commentId);
    const comment = await getDoc(commentRef);
    return comment.data();
}
