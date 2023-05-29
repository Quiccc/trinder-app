import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import ForumComponent from "../components/ForumComponent/ForumComponent";

const ForumPage = () => {
    return (
        <>
            <Navbar design={true} />
            <ForumComponent />
            <Footer />
        </>
    );
};

export default ForumPage;