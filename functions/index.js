const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")("sk_test_51NBFvFAASgC4i4iIgfkdEwuBM7MDwY0IAkJzuFLjO2g6lfyIOzj97a0rTRL24I7RKexXHNuJnmTv2dPNsqiGyKni00YyaExaTm");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

async function purchasePackage(customerId, periodStart,periodEnd,price) {
    //Create a new document in the premiumUsers collection with customerId as the document id
    await admin.firestore().collection("premiumUsers").doc(customerId).set({
        periodStart: periodStart,
        periodEnd: periodEnd,
        price: price
    });
    await admin.firestore().collection("user").doc(customerId).update({
        premiumID: customerId
    });
}    
exports.purchasePackageUpdate = functions.firestore
    .document("customers/{customerId}/subscriptions/{subscriptionId}")
    .onUpdate(async (change, context) => {
        // //If the status changed and it is now active purchase the package
        const previousValue = change.before.data();
        const newValue = change.after.data();
        const customerId = context.params.customerId;
        if (newValue.status === "active" && previousValue.status !== "active") {
            const customerId = context.params.customerId;
            const periodStart = newValue.current_period_start;
            const periodEnd = newValue.current_period_end;
            const price = newValue.price;
            await purchasePackage(customerId, periodStart, periodEnd, price);
        }
        if (newValue.status === "canceled") {
            await admin.firestore().collection("premiumUsers").doc(customerId).delete();
            await admin.firestore().collection("user").doc(customerId).update({
                premiumID: null
            });
            //Make is_active = false for all advertisements
            await admin.firestore().collection("adverts").where("user_id", "==", customerId).where("is_active", "==", true).get().then((querySnapshot) => {
                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    const doc = querySnapshot.docs[i];
                    admin.firestore().collection("adverts").doc(doc.id).update({
                        is_active: false
                    });
                }
            });

            //Make the newest advertisement is_active = true
            await admin.firestore().collection("adverts").where("user_id", "==", customerId).orderBy("created_at", "desc").limit(1).get().then((querySnapshot) => {
                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    const doc = querySnapshot.docs[i];
                    admin.firestore().collection("adverts").doc(doc.id).update({
                        is_active: true
                    });
                }
            });

        }
    });

exports.purchasePackageCreate = functions.firestore
    .document("customers/{customerId}/subscriptions/{subscriptionId}")
    .onCreate(async (snapshot, context) => {
        const newValue = snapshot.data();
        const customerId = context.params.customerId;
        await admin.firestore().collection("log").doc(customerId).set({
            newValue: newValue
        });
        const periodStart = newValue.current_period_start;
        const periodEnd = newValue.current_period_end;
        const price = newValue.price;
        if (newValue.status === "active"){
            await purchasePackage(customerId, periodStart, periodEnd, price);
        }
    });

exports.cancelSubscription = functions.https.onCall(async (data, context) => {
    const result = await stripe.subscriptions.update(data.subscriptionId, {
        cancel_at_period_end: true
    });
    return result;
}); 

//Not premium user can only one active advertisement, if new advertisement is created, the old one will be is_active = false
// exports.createAdvertisement = functions.firestore
//     .document("adverts/{advertisementId}")
//     .onCreate(async (snapshot, context) => {
//         const newValue = snapshot.data();
//         const userId = newValue.user_id;
//         const is_active = newValue.is_active;
//         const is_premium = admin.firestore().collection("premiumUsers").doc(userId).get().then((doc) => {
//             if (doc.exists) {
//                 return true;
//             } else {
//                 return false;
//             }
//         });
//         await admin.firestore().collection("logsTrial").doc(userId).set({
//             is_active: is_active,
//             is_premium: is_premium
//         });
//         if (is_active === true && is_premium === false) {
//             await admin.firestore().collection("adverts").where("user_id", "==", userId).where("is_active", "==", true).get().then(async (querySnapshot) => {
//                 for (let i = 0; i < querySnapshot.docs.length; i++) {
//                     if (querySnapshot.docs[i].id !== context.params.advertisementId) {
//                         const doc = querySnapshot.docs[i];
//                         await admin.firestore().collection("adverts").doc(doc.id).update({
//                             is_active: false
//                         });
//                     }
//                 }
//             });
//         }
//     });

//Disable user account on call
exports.disableUser = functions.https.onCall(async (data, context) => {
    //Disable user account
    const result = await admin.auth().updateUser(data.uid, {
        disabled: true
    });
    //Delete all their advertisements
    await admin.firestore().collection("adverts").where("user_id", "==", data.uid).get().then(async (querySnapshot) => {
        for (let i = 0; i < querySnapshot.docs.length; i++) {
            const doc = querySnapshot.docs[i];
            await admin.firestore().collection("adverts").doc(doc.id).delete();
            //If there is report for this advertID, delete it
            await admin.firestore().collection("reports").where("advertID", "==", doc.id).get().then(async (querySnapshot) => {
                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    const doc = querySnapshot.docs[i];
                    await admin.firestore().collection("reports").doc(doc.id).delete();
                }
            });
        }
    });

    //Delete all their chats, it may be advertOwnerId  
    await admin.firestore().collection("chats").where("advertOwnerId", "==", data.uid).get().then(async (querySnapshot) => {
        for (let i = 0; i < querySnapshot.docs.length; i++) {
            const doc = querySnapshot.docs[i];
            await admin.firestore().collection("chats").doc(doc.id).delete();
        }
    });
    //Delete all their chats, it may be messagerId 
    await admin.firestore().collection("chats").where("messagerId", "==", data.uid).get().then(async (querySnapshot) => {
        for (let i = 0; i < querySnapshot.docs.length; i++) {
            const doc = querySnapshot.docs[i];
            await admin.firestore().collection("chats").doc(doc.id).delete();
        }
    });

    //Delete all their comments
    await admin.firestore().collection("topicComments").where("createdBy", "==", data.uid).get().then(async (querySnapshot) => {
        for (let i = 0; i < querySnapshot.docs.length; i++) {
            const doc = querySnapshot.docs[i];
            await admin.firestore().collection("topicComments").doc(doc.id).delete();
            //If there is reports for this commentId, delete them
            await admin.firestore().collection("reports").where("commentId", "==", doc.id).get().then(async (querySnapshot) => {
                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    const doc = querySnapshot.docs[i];
                    await admin.firestore().collection("reports").doc(doc.id).delete();
                }
            });
        }
    });

    //Delete all their reports, it may be senderId
    await admin.firestore().collection("reports").where("senderId", "==", data.uid).get().then(async (querySnapshot) => {
        for (let i = 0; i < querySnapshot.docs.length; i++) {
            const doc = querySnapshot.docs[i];
            await admin.firestore().collection("reports").doc(doc.id).delete();
        }
    });
    //Delete all their reports, it may be userId
    await admin.firestore().collection("reports").where("userId", "==", data.uid).get().then(async (querySnapshot) => {
        for (let i = 0; i < querySnapshot.docs.length; i++) {
            const doc = querySnapshot.docs[i];
            await admin.firestore().collection("reports").doc(doc.id).delete();
        }
    });


    //Delete from premiumUsers collection
    await admin.firestore().collection("premiumUsers").doc(data.uid).delete();
    //Delete from user collection
    await admin.firestore().collection("user").doc(data.uid).delete();

    return result;
});

exports.deleteAdvert = functions.https.onCall(async (data, context) => {
    //Delete advert from adverts collection and chat from chats collection and reports collection 
    const advertId = data.advertId;
    await admin.firestore().collection("adverts").doc(advertId).delete();
    await admin.firestore().collection("chats").where("advertId", "==", advertId).get().then(async (querySnapshot) => {
        for (let i = 0; i < querySnapshot.docs.length; i++) {
            const doc = querySnapshot.docs[i];
            await admin.firestore().collection("chats").doc(doc.id).delete();
        }
    });
    await admin.firestore().collection("reports").where("advertID", "==", advertId).get().then(async (querySnapshot) => {
        for (let i = 0; i < querySnapshot.docs.length; i++) {
            const doc = querySnapshot.docs[i];
            await admin.firestore().collection("reports").doc(doc.id).delete();
        }
    });
});

exports.deleteComment = functions.https.onCall(async (data, context) => {
    //Delete comment from topicComments collection
    const commentId = data.commentId;
    await admin.firestore().collection("topicComments").doc(commentId).delete();
    //Delete all reports for this comment
    await admin.firestore().collection("reports").where("commentId", "==", commentId).get().then(async (querySnapshot) => {
        for (let i = 0; i < querySnapshot.docs.length; i++) {
            const doc = querySnapshot.docs[i];
            await admin.firestore().collection("reports").doc(doc.id).delete();
        }
    });
});

exports.deleteReport = functions.https.onCall(async (data, context) => {
    //Delete report from reports collection
    const reportId = data.reportId;
    await admin.firestore().collection("reports").doc(reportId).delete();
});

// //If user make upload a advertisement and is_active changed to true, the old one will be is_active = false
// exports.updateAdvertisement = functions.firestore
//     .document("adverts/{advertisementId}")
//     .onUpdate(async (change, context) => {
//         //If new value is active and old value is not active
//         const previousValue = change.before.data();
//         const newValue = change.after.data();
//         const userId = newValue.user_id;
//         const is_active = newValue.is_active;
//         const is_premium = admin.firestore().collection("premiumUsers").doc(userId).get().then((doc) => {
//             if (doc.exists) {
//                 return true;
//             } else {
//                 return false;
//             }
//         });
//         if (is_active === true && previousValue.is_active !== true && is_premium === false) {
//             await admin.firestore().collection("log").doc(userId).set({
//                 newValue: newValue
//             });
//             await admin.firestore().collection("adverts").where("user_id", "==", userId).where("is_active", "==", true).get().then(async (querySnapshot) => {
//                 //Create doc wih auto id
//                 await admin.firestore().collection("log").add({
//                     querySnapshot: querySnapshot.docs.length,
//                 });
//                 for (let i = 0; i < querySnapshot.docs.length; i++) {
//                     //Add the "log" collection
//                     await admin.firestore().collection("log").add({
//                         querySnapshot: querySnapshot.docs[i].id,
//                         advertisementId: context.params.advertisementId,
//                         i: i
//                     });
//                     // if (querySnapshot.docs[i].id !== context.params.advertisementId) {
//                     //     const doc = querySnapshot.docs[i];
//                     //     await admin.firestore().collection("adverts").doc(doc.id).update({
//                     //         is_active: false
//                     //     });
//                     // }
//                 }
//             });
//         }
//     });