import { useLocation } from "react-router";
import ChatComponent from "../components/ChatComponent/ChatComponent";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const ChatPage = () => {
    const location = useLocation();
    return (
        <>
            <Navbar design={true} />
            {
                location.state && location.state.chatId ? <ChatComponent chatId={location.state.chatId} /> : <ChatComponent />
            }
            <Footer />
        </>
    );
};

export default ChatPage;