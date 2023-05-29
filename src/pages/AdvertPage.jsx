import AdvertPageComponent from "../components/AdvertPageComponent/AdvertPageComponent";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
const AdvertPage = () => {
    return (
        <>
            <Navbar design={true} />
            <AdvertPageComponent />
            <Footer />
        </>
    )
};

export default AdvertPage;