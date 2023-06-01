import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import ForumComponent from "../components/ForumComponent/ForumComponent";
import { useLocation } from "react-router";

const ForumPage = () => {
    const location = useLocation();
    return (
        <>
            <Navbar design={true} />
            {
                location.state && location.state.topicId ? <ForumComponent topicId={location.state.topicId} /> : <ForumComponent />
            }
            <Footer />
        </>
    );
};

export default ForumPage;