import "./App.css"
import AppRouter from "./app-router/AppRouter"
import { AuthProvider } from "./contexts/AuthContext";
import { Helmet, HelmetProvider } from "react-helmet-async";

function App() {
    return (
        <HelmetProvider>
        <AuthProvider>
            <Helmet></Helmet>
            <AppRouter />
        </AuthProvider>
        </HelmetProvider>
    );
}

export default App;