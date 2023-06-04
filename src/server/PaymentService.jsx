import { addDoc, collection, doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { auth, db } from "./config/FirebaseConfig";
import { loadStripe } from "@stripe/stripe-js";
import { getFunctions, httpsCallable } from "firebase/functions";

export const checkOut = async (priceId) => {
    //Recurring payment
    const docRef = await addDoc(
        collection(db, "customers", auth.currentUser.uid, "checkout_sessions"),
        {
          price: priceId,
          success_url: "https://trinder-4pp.web.app//success",
          cancel_url: "https://trinder-4pp.web.app/decline",
          mode: "subscription",
        }
      );
      onSnapshot(docRef, async (snap) => {
        const { error, sessionId } = snap.data();
        if (error) {
          alert(error.message);
          window.location.reload();
        }
        if (sessionId) {
          const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PK);
          stripe.redirectToCheckout({ sessionId });
        }
      });
};

export const cancelSubscription = async (subscriptionId) => {
    const functions = getFunctions();
    const cancelSubscription = httpsCallable(functions, "cancelSubscription");
    let result = await cancelSubscription({ subscriptionId: subscriptionId });
    return result.data;
};

export const getActiveSubscription = async () => {
    //There is subscriptions table inside the customers table get the active subscription
    const docRef = collection(db, "customers", auth.currentUser.uid, "subscriptions");
    const snap = await getDocs(docRef);
    let subscription = null;
    for (const doc of snap.docs) {
        if (doc.data().status === "active") {
            subscription = doc.data();
            subscription.id = doc.id;
            break;
        }
    }
    return subscription.id;
};

export const getIsUserHasActiveSubscription = async () => {
    const docRef = collection(db, "customers", auth.currentUser.uid, "subscriptions");
    const snap = await getDocs(docRef);
    let subscription = false;
    for (const doc of snap.docs) {
      //Check if there is an active subscription and cancel_at_period_end is false
        if (doc.data().status === "active" && doc.data().cancel_at_period_end === true) {
            return {
                canceledDate: new Date(doc.data().cancel_at.seconds * 1000).toLocaleDateString(),
                subscription: false,
            }
        }
        if (doc.data().status === "active" && doc.data().cancel_at_period_end === false) {
            subscription = doc.data();
            subscription.id = doc.id;
            break;
        }
    }
    return {
      canceledDate: null,
      subscription: subscription,
    }
};

export const getIsUserPremium = async () => {
    //Check the premiumUsers table have document with current user id
    const docRef = doc(db, "premiumUsers", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return true;
    }
    return false;
};