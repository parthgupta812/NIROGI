import { Users, Stethoscope, Globe2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const pillarIcons = [Users, Stethoscope, Globe2];

function About() {
    const { dictionary } = useLanguage();
    const content = dictionary.about;

    return (
        <div className="space-y-12 animate-fade-in">
            <header className="space-y-3 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
                <p className="text-gray-600 max-w-2xl">{content.subtitle}</p>
            </header>

            <section className="grid gap-6 md:grid-cols-3">
                {content.pillars.map((pillar, index) => {
                    const Icon = pillarIcons[index] ?? Users;
                    return (
                        <article key={pillar.title} className="rounded-3xl bg-white p-6 shadow-soft">
                            <Icon className="mb-4 h-10 w-10 text-green-600" aria-hidden="true" />
                            <h2 className="mb-2 text-lg font-semibold text-gray-900">{pillar.title}</h2>
                            <p className="text-sm text-gray-600">{pillar.description}</p>
                        </article>
                    );
                })}
            </section>

            <section className="rounded-3xl bg-white p-8 shadow-soft">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">{content.foundationTitle}</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                    {content.foundationPoints.map((point) => (
                        <li key={point}>• {point}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default About;
