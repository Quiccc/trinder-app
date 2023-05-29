import { createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { auth, db, storageRef } from "./config/FirebaseConfig";

export const userRegister = async (newUser) => {
    await createUserWithEmailAndPassword(auth,newUser.email, newUser.password);
    await setDoc(doc(db, "user", auth.currentUser.uid), {
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        isAdmin: false,
        premiumID: null,
        isVerified: false,
    });
};

export const userLogin = async (email,password) => {
    return await signInWithEmailAndPassword(auth,email, password);
};

export const userLogout = async () => {
    return await auth.signOut();
};

export const updateProfileFirebase = async (newUser) => {
    const user = auth.currentUser;
    const userRef = doc(db, "user", user.uid);
    let folderRef = ref(storageRef, "user/" + user.uid + "/profilePicture");
    let urlReturn = "";
    if (newUser.profile_image !== null) {
        //First delete old images in folder reference
        await listAll(folderRef).then((res) => {
            res.items.forEach((itemRef) => {
                deleteObject(itemRef);
            });
        });

        let imageRef = ref(folderRef, newUser?.profile_image?.name);
        await uploadBytes(imageRef, newUser.profile_image.originFileObj).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(async (url) => {
                await updateDoc(userRef, {
                    name: newUser.name,
                    surname: newUser.surname,
                    profile_image: {
                        name: newUser.profile_image.name,
                        url: url,
                    }
                });
                urlReturn = url;
            });
        });
    }
    else {
        await updateDoc(userRef, {
            name: newUser.name,
            surname: newUser.surname,
            email: newUser.email,
            profile_image: null,
        });
    }
    return urlReturn;
};

export const changePasswordAuth = async (oldPassword, newPassword) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    let errorMessage = "";
    try {
        await reauthenticateWithCredential(user, credential).then(async (res) => {
          await updatePassword(user, newPassword);
          errorMessage = "true";
        });
    } catch (error) {
        errorMessage = error.code;
    } finally {
        return errorMessage;
    }
};

export const emailVerification = async () => {
    await sendEmailVerification(auth.currentUser, {
        url: "http://localhost:3000/verify",
    }).catch((error) => {
        console.log(error);
    });
};

export const resetPasswordFirebase = async (email) => {
    await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:3000/reset",
    }).catch((error) => {
        console.log(error);
    });
};

export const isUserVerified = () => {
    return auth?.currentUser?.emailVerified;
};

export const deleteAccount = async () => {

};

export const getCurrentUser = () => {
    return auth.currentUser !== null ? auth.currentUser : null;
};

export const getCurrentUserDetails = async () => {
    const userRef = doc(db, "user", auth?.currentUser?.uid);
    const user = await getDoc(userRef);
    let returnData = {
        name: user.data().name,
        surname: user.data().surname,
        email: user.data().email,
        isAdmin: user.data().isAdmin,
        premiumID: user.data().premiumID,
        isVerified: user.data().isVerified,
        profile_image: user.data().profile_image,
    };
    return returnData;
};


export const getPremiumDetails = async () => {
    const userRef = doc(db, "premiumUsers", auth.currentUser.uid);
    const user = await getDoc(userRef);
    let userReturn = user.data();
    userReturn.premiumEndDate = user.data().periodEnd.toDate().toLocaleDateString();
    return userReturn;
};

export const isCurrentUserAdmin = async () => {
    const userRef = doc(db, "user", auth.currentUser.uid);
    const user = await getDoc(userRef);
    return user.data().isAdmin;
};