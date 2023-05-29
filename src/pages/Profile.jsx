
import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import ProfileComponent from '../components/ProfileComponent/ProfileComponent'
import Footer from "../components/Footer/Footer";

const Profile = () => {
    return (
        <>
            <Navbar design={true} />
            <ProfileComponent />
            <Footer />
        </>
    )
}

export default Profile