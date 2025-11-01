import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function MainLayout() {
    return (
        <div className="min-h-screen bg-brand-surface text-gray-900">
            <Navbar />
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 pb-16 pt-10 md:px-6">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
