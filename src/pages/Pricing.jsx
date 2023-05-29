import Navbar from "../components/Navbar/Navbar";
import PricingComponent from "../components/PricingComponent/PricingComponent";
import Footer from "../components/Footer/Footer";

const Pricing = () => {
    return(
        <>
            <Navbar design={true} />
            <PricingComponent />
            <Footer />
        </>
    )
};

export default Pricing;