import { useAuth } from "../contexts/AuthContext";
import {
    useLocation,
    Navigate,
    Outlet,
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Home from "../pages/Home"
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import AdvertPage from "../pages/AdvertPage";
import CreateAdvertPage from "../pages/CreateAdvert";
import ChatPage from "../pages/ChatPage";
import AdvertSearchPage from "../pages/AdvertSearchPage";
import Pricing from "../pages/Pricing";
import PageNotFound from "../pages/PageNotFound";
import CookiesComponent from "../components/CookiesComponent/CookiesComponent";
import Successful from "../pages/Successful";
import AdminPanel from "../adminPanel/AdminPanel";
import Loading from "../components/Loading/Loading";
import ForumPage from "../pages/ForumPage";

const AppRouter = () => {
    const { currentUser, userDetails, loading } = useAuth();
    function PrivateRouter() {
        let location = useLocation();
        if (loading) {
            //Put loading screen here
            return <Loading />;
        }
        if (!currentUser) {
            // Redirect them to the /login page, but save the current location they were
            // trying to go to when they were redirected. This allows us to send them
            // along to that page after they login, which is a nicer user experience
            // than dropping them off on the home page.
            return <Navigate to="/login" state={{ from: location }} replace={true} />;
        } else {
            return <Outlet />;
        }
    };

    function AdminRouter() {
        let location = useLocation();
        if (loading) {
            //Put loading screen here
            return <Loading />;
        }
        if (!currentUser) {
            return <Navigate to="/404" state={{ from: location }} replace={true} />;
        } else {
            if (userDetails.isAdmin) {
                return <Outlet />;
            } else {
                return <Navigate to="/404" state={{ from: location }} replace={true} />;
            }
        }
    }
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/advert/:id" element={<AdvertPage />} />
                <Route element={<PrivateRouter />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/success" element={<Successful />} />
                    <Route path="/post" element={<CreateAdvertPage />} >
                        <Route path="/post/details/advert-service" element={<CreateAdvertPage />} />
                        <Route path="/post/details/advert-model" element={<CreateAdvertPage />} />
                        <Route path="/post/details/advert-request" element={<CreateAdvertPage />} />
                    </Route>
                </Route>
                <Route element={<AdminRouter />}>
                    <Route path="/panel" element={<AdminPanel />} />
                </Route>
                <Route path="/search" element={<AdvertSearchPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="*" element={<PageNotFound />} />
                <Route path="/forum" element={<ForumPage />} />

            </Routes>
            <CookiesComponent />
        </BrowserRouter>
    )
};

export default AppRouter;