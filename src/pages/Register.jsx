import Navbar from "../components/Navbar/Navbar"
import RegisterComponent from "../components/RegisterComponent/RegisterComponent"
import Footer from "../components/Footer/Footer";

const Register = () => {
    return (
        <>
            <Navbar design={true} />
            <RegisterComponent />
            <Footer />
        </>
    )
}

export default Register