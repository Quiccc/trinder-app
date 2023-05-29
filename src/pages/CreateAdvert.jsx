import CreateAdvert from "../components/CreateAdvert/CreateAdvert";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const CreateAdvertPage = () => {
    return (
        <>
        <Navbar design={true} />
        <CreateAdvert />
        <Footer />
        </>
    );
};

export default CreateAdvertPage;