import Router from "./router/Router";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AlarmProvider } from "./context/AlarmContext.jsx";
import "./App.css";

export default function App() {
    return (
        <AuthProvider>
            <AlarmProvider>
                <Router />
            </AlarmProvider>
        </AuthProvider>
    );
}