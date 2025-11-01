import { Activity, Syringe, AlertTriangle, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const highlightIcons = [Activity, AlertTriangle, Syringe];

function Dashboard() {
    const { dictionary } = useLanguage();
    const content = dictionary.dashboard;

    return (
        <div className="space-y-10 animate-fade-in">
            <header className="space-y-3 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
                <p className="text-gray-600 max-w-2xl">{content.subtitle}</p>
            </header>

            <section className="grid gap-6 md:grid-cols-3">
                {content.highlights.map((highlight, index) => {
                    const Icon = highlightIcons[index] ?? Activity;
                    return (
                        <article key={highlight.title} className="rounded-3xl bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <Icon className="h-6 w-6" />
                            </div>
                            <h2 className="mb-2 text-lg font-semibold text-gray-900">{highlight.title}</h2>
                            <p className="text-sm text-gray-600">{highlight.description}</p>
                        </article>
                    );
                })}
            </section>

            {content.summaryStats?.length ? (
                <section className="rounded-3xl bg-white p-6 shadow-soft">
                    <h2 className="text-2xl font-semibold text-gray-900">{content.summaryTitle}</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {content.summaryStats.map((stat) => (
                            <article key={stat.label} className="rounded-2xl border border-green-100 bg-green-50/60 p-5">
                                <p className="text-sm font-medium uppercase tracking-wide text-green-700">{stat.label}</p>
                                <p className="mt-3 text-3xl font-semibold text-gray-900">{stat.value}</p>
                                <p className="mt-2 text-sm text-gray-600">{stat.delta}</p>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}

            {content.alerts?.length ? (
                <section className="rounded-3xl bg-white p-6 shadow-soft">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">{content.alertsTitle}</h2>
                    <div className="space-y-4">
                        {content.alerts.map((alert) => (
                            <article key={alert.title} className="rounded-2xl border border-green-100 bg-green-50/60 p-5">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                                            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                                            <p className="mt-1 text-sm text-gray-600">{alert.description}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex w-max rounded-full bg-green-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                                        {alert.level}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}

            {content.vaccinationDrives?.length ? (
                <section className="rounded-3xl bg-white p-6 shadow-soft">
                    <div className="mb-4 space-y-2">
                        <h2 className="text-2xl font-semibold text-gray-900">{content.vaccinationTitle}</h2>
                        <p className="text-sm text-gray-600">{content.vaccinationSubtitle}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {content.vaccinationDrives.map((drive) => (
                            <article key={drive.name} className="flex flex-col gap-3 rounded-2xl border border-green-100 bg-green-50/60 p-5">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{drive.name}</h3>
                                    <p className="mt-1 text-sm text-gray-600">{drive.services}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-green-700">
                                    <MapPin className="h-4 w-4" aria-hidden="true" />
                                    <span>{drive.location}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-700">{drive.schedule}</p>
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}

            <section className="rounded-3xl bg-white p-8 shadow-soft">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">{content.comingSoonTitle}</h2>
                <p className="text-gray-600">{content.comingSoonBody}</p>
            </section>
        </div>
    );
}

export default Dashboard;
