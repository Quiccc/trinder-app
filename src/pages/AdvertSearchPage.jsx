import { useState } from "react";
import AdvertSearchPageComponent from "../components/AdvertSearchPageComponent/AdvertSearchPageComponent";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const AdvertSearchPage = () => {
    const [dataFromNavbar, setDataFromNavbar] = useState({
        location: localStorage.getItem('selectedLocation'),
        value: null
    });
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
    return(
        <>
            <Navbar design={true} onData={handleDataFromNavbar} onSearchData={handleDataFromNavbarSearch} />
            <AdvertSearchPageComponent data={dataFromNavbar} />
            <Footer />
        </>
    );
};

export default AdvertSearchPage;