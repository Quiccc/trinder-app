import { useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router";
import AdvertGrid from "../components/AdvertGrid/AdvertGrid";
import Footer from "../components/Footer/Footer";
import LandPage from "../components/LandPageComponent/LandPageComponent";
import Navbar from "../components/Navbar/Navbar";
import useNotification from "../hooks/UseNotification";


const Home = () => {
    const [dataFromNavbar, setDataFromNavbar] = useState({
        location: null,
        value: null
    });
    const location = useLocation();
    const navigate = useNavigate()
    const { alertSuccess } = useNotification();
    useEffect(() => {
        //if pass state is true, show success alert
        let state = location.state;
        //if previous page is https://frewell.com/register
        if (state?.register) {
            alertSuccess("You have successfully registered! Please check your email to verify your account.")
            navigate('/', { state: { register: false } });
        }
        // eslint-disable-next-line   
    }, [])

    const handleDataFromNavbar = (data) => {
        setDataFromNavbar({
            ...dataFromNavbar,
            location: data
        }) 
    }
    const handleDataFromNavbarSearch = (data) => {
        setDataFromNavbar({
            ...dataFromNavbar,
            value: data
        })
    }
    useEffect(() => {

    }, [dataFromNavbar])
    return (
        <div>
            <Navbar onData={handleDataFromNavbar} onSearchData={handleDataFromNavbarSearch} />
            <LandPage/>
            <AdvertGrid data={dataFromNavbar} />
            <Footer />
        </div>
    );
}

export default Home;