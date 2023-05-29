
export const getAlertMessage = (status) => {
    switch (status) {
        case 'auth/email-already-in-use':
            return "auth/email-already-in-use";
        case 'auth/wrong-password':
            return "auth/wrong-password";
        case 'auth/too-many-requests':
            return "auth/too-many-requests";
        case 'verify-email':
            return "verify-email";
        case 'auth/user-not-found':
            return "auth/user-not-found";
        case 'auth/invalid-email':
            return "auth/invalid-email";
        case 'auth/network-request-failed':
            return "auth/network-request-failed";
        case 'auth/missing-email':
            return "auth/missing-email";
        default:
            return "auth/network-request-failed";
    }
}