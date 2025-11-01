import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import LanguageDropdown from "./LanguageDropdown.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    const navItems = useMemo(
        () => [
            { to: "/", label: t("nav.home") },
            { to: "/chat", label: t("nav.chatbot") },
            { to: "/dashboard", label: t("nav.dashboard") },
            { to: "/about", label: t("nav.about") }
        ],
        [t]
    );

    function closeMenu() {
        setIsOpen(false);
    }

    return (
        <nav className="shadow-sm bg-white sticky top-0 z-50 border-b border-green-100/40">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
                <NavLink
                    to="/"
                    className="flex items-center gap-2 text-xl font-semibold text-gray-900 transition-transform duration-200 hover:scale-105"
                    onClick={closeMenu}
                >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-inner">🩺</span>
                    <span>Nirogi</span>
                </NavLink>

                <div className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                clsx(
                                    "text-gray-700 hover:text-green-600 transition font-medium border-b-2 border-transparent hover:border-green-500",
                                    isActive && "text-green-600 border-green-500"
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden items-center gap-4 md:flex">
                    <LanguageDropdown />
                </div>

                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-green-100 p-2 text-green-600 transition hover:border-green-200 hover:bg-green-50 md:hidden"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label="Toggle navigation menu"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {isOpen ? (
                <div className="border-t border-green-100 bg-white px-4 pb-4 pt-3 md:hidden">
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    clsx(
                                        "text-gray-700 hover:text-green-600 transition font-medium border-b-2 border-transparent hover:border-green-500",
                                        isActive && "text-green-600 border-green-500"
                                    )
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        <LanguageDropdown size="sm" />
                    </div>
                </div>
            ) : null}
        </nav>
    );
}

export default Navbar;
