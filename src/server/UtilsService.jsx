import { auth } from "./config/FirebaseConfig";


export const isCurrentUserVerified = async () => {
    return auth?.currentUser?.emailVerified;
};

export const convertTimeStampToDateChat = (timestamp) => {
    let date = new Date(timestamp.seconds * 1000);
    //New Format is hh/mm if minutes is less than 10 add 0 before and same for hours
    return (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
};

export const convertTimeStampToDate = (timestamp) => {
    let date = new Date(timestamp.seconds * 1000);
    //New Format is dd/mm/yyyy if day or month is less than 10 add 0 before
    return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/" + date.getFullYear()
};

export const convertTimeStampToDateAdvertCard = (timestamp) => {
    let date = null;
    if (timestamp?.seconds ) {
        date = new Date(timestamp.seconds * 1000);
    }else {
        date = new Date(timestamp);
    }
    //New Format is dd "month", month can be Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
    return date.getDate() + " " + date.toLocaleString('default', { month: 'short' });
};

export const convertTimeStampToDateAdvertCardWithYear = (timestamp) => {
    let date = null;
    if (timestamp?.seconds ) {
        date = new Date(timestamp.seconds * 1000);
    }else {
        date = new Date(timestamp);
    }
    //New Format is dd "month", month can be Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
    return date.getDate() + " " + date.toLocaleString('default', { month: 'short' }) + " " + date.getFullYear();
};

export const convertTimeStampToDateForumComment = (timestamp) => {
    //Format is dd/ "month" hh:mm, month can be Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
    let date = null;
    if (timestamp?.seconds ) {
        date = new Date(timestamp.seconds * 1000);
    }else {
        date = new Date(timestamp);
    }
    return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + date.toLocaleString('default', { month: 'short' }) + " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
};