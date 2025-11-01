import { HeartPulse, Globe2, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

function Home() {
    const { dictionary } = useLanguage();
    const content = dictionary.home;

    return (
        <div className="space-y-16">
            <section className="bg-gradient-to-b from-green-50 to-white py-16 px-6 rounded-3xl shadow-sm animate-fade-in">
                <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                        <ShieldCheck size={18} />
                        {content.badge}
                    </span>
                    <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                        {content.titlePrefix}
                        <span className="text-green-600">{content.titleHighlight}</span>
                        {content.titleSuffix}
                    </h1>
                    <p className="text-lg text-gray-600 md:text-xl">
                        {content.subtitle}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            to="/chat"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-md transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
                        >
                            {content.ctaPrimary}
                        </Link>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 rounded-full border border-green-200 px-5 py-3 text-green-700 transition hover:bg-green-50"
                        >
                            {content.ctaSecondary}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-8 md:grid-cols-2">
                <article className="rounded-3xl bg-white p-8 shadow-soft animate-fade-in">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        <HeartPulse className="mr-2 inline-block text-green-600" /> {content.missionTitle}
                    </h2>
                    <p className="text-gray-600">
                        {content.missionBody}
                    </p>
                </article>
                <article className="rounded-3xl bg-white p-8 shadow-soft animate-fade-in">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        <Globe2 className="mr-2 inline-block text-green-600" /> {content.visionTitle}
                    </h2>
                    <p className="text-gray-600">
                        {content.visionBody}
                    </p>
                </article>
            </section>
        </div>
    );
}

export default Home;
