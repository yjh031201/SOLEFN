import Router from "./router/Router";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./App.css";

export default function App() {
    return (
        <AuthProvider>
            <Router />
        </AuthProvider>
    );
}