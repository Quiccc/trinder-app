
import LoginComponent from '../components/LoginComponent/LoginComponent'
import Navbar from '../components/Navbar/Navbar'
import Footer from "../components/Footer/Footer";

const Login = () => {
    return (
        <>
            <Navbar design={true} />
            <LoginComponent />
            <Footer />
        </>
    )
}

export default Login