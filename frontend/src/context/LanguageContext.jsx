import { createContext, useContext, useMemo, useState } from "react";
import { messages } from "../i18n/messages.js";

const LanguageContext = createContext({
    language: "en",
    setLanguage: () => { },
    languages: [],
    dictionary: messages.en,
    t: () => ""
});

const messageEntries = Object.entries(messages);

function getFromDictionary(dictionary, path) {
    return path.split(".").reduce((accumulator, key) => {
        if (accumulator && key in accumulator) {
            return accumulator[key];
        }
        return undefined;
    }, dictionary);
}

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState("en");

    const languages = useMemo(
        () =>
            messageEntries.map(([code, dictionary]) => ({
                value: code,
                label: dictionary.meta?.label ?? code
            })),
        []
    );

    const value = useMemo(
        () => {
            const dictionary = messages[language] ?? messages.en;
            return {
                language,
                setLanguage,
                languages,
                dictionary,
                t: (path) => getFromDictionary(dictionary, path)
            };
        },
        [language, languages]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
