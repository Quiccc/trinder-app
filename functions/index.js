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
exports.createAdvertisement = functions.firestore
    .document("adverts/{advertisementId}")
    .onCreate(async (snapshot, context) => {
        const newValue = snapshot.data();
        const userId = newValue.user_id;
        const is_active = newValue.is_active;
        const is_premium = admin.firestore().collection("premiumUsers").doc(userId).get().then((doc) => {
            if (doc.exists) {
                return true;
            } else {
                return false;
            }
        });
        await admin.firestore().collection("logsTrial").doc(userId).set({
            is_active: is_active,
            is_premium: is_premium
        });
        if (is_active === true && is_premium === false) {
            await admin.firestore().collection("adverts").where("user_id", "==", userId).where("is_active", "==", true).get().then(async (querySnapshot) => {
                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    if (querySnapshot.docs[i].id !== context.params.advertisementId) {
                        const doc = querySnapshot.docs[i];
                        await admin.firestore().collection("adverts").doc(doc.id).update({
                            is_active: false
                        });
                    }
                }
            });
        }
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