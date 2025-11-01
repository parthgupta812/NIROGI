import { useEffect, useRef, useState } from "react";
import { Check, Globe2 } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const sizePresets = {
    md: "px-3 py-2 text-sm",
    sm: "px-3 py-2 text-sm",
    lg: "px-4 py-2.5 text-base"
};

function LanguageDropdown({ size = "md" }) {
    const { language, setLanguage, languages } = useLanguage();
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentLanguage = languages.find((item) => item.value === language);

    function handleSelect(value) {
        setLanguage(value);
        setOpen(false);
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={clsx(
                    "group inline-flex items-center gap-2 rounded-full border border-green-100 bg-white text-gray-700 transition-all duration-200 hover:border-green-200 hover:bg-green-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-100",
                    sizePresets[size]
                )}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <Globe2 className="h-4 w-4 text-green-600 transition-transform group-hover:rotate-6" aria-hidden="true" />
                <span className="font-medium">
                    {currentLanguage ? currentLanguage.label : "Select Language"}
                </span>
                <span className="text-xs text-gray-400">▼</span>
            </button>

            {open ? (
                <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-green-100 bg-white p-2 shadow-soft ring-1 ring-black/5 animate-fade-in">
                    <ul className="space-y-1" role="listbox">
                        {languages.map((item) => (
                            <li key={item.value}>
                                <button
                                    type="button"
                                    className={clsx(
                                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-green-50 hover:text-green-700",
                                        item.value === language ? "bg-green-50 text-green-700" : "text-gray-700"
                                    )}
                                    onClick={() => handleSelect(item.value)}
                                    role="option"
                                    aria-selected={item.value === language}
                                >
                                    <span>{item.label}</span>
                                    {item.value === language ? <Check className="h-4 w-4" /> : null}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
}

export default LanguageDropdown;
