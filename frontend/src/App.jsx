import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import About from "./pages/About.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";

function App() {
    return (
        <LanguageProvider>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<Chatbot />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/about" element={<About />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </LanguageProvider>
    );
}

export default App;
