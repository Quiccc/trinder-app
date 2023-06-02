
export const getAlertMessage = (status) => {
    switch (status) {
        case 'auth/email-already-in-use':
            return "Email already in use";
        case 'auth/wrong-password':
            return "Wrong password";
        case 'auth/too-many-requests':
            return "You have tried too many times, please try again later";
        case 'verify-email':
            return "Please verify your email";
        case 'auth/user-not-found':
            return "User not found";
        case 'auth/invalid-email':
            return "Invalid email";
        case 'auth/network-request-failed':
            return "Network request failed, please try again later";
        case 'auth/missing-email':
            return "Please enter your email";
        default:
            return "Network request failed, please try again later";
    }
}