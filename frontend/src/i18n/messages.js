export const messages = {
    en: {
        meta: {
            label: "English"
        },
        nav: {
            home: "Home",
            chatbot: "Chatbot",
            dashboard: "Dashboard",
            about: "About"
        },
        home: {
            badge: "Trusted by health seekers worldwide",
            titlePrefix: "Stay informed, stay healthy with ",
            titleHighlight: "Nirogi",
            titleSuffix: "",
            subtitle:
                "Get real-time outbreak alerts, personalized health tips, and nearby medical support — all in one AI-powered companion.",
            ctaPrimary: "Try the Chatbot Now",
            ctaSecondary: "Explore Dashboard",
            missionTitle: "Our Mission",
            missionBody:
                "We empower communities with accessible, reliable health information. Nirogi simplifies complex medical data into everyday guidance so you can make confident decisions for yourself and your family.",
            visionTitle: "A Global View of Wellness",
            visionBody:
                "From localized outbreak alerts to global health trends, we bring together the signals that matter most. Nirogi supports multiple languages so more people can tap into timely health insights."
        },
        chat: {
            headline: "Talk to Nirogi – Your AI Health Companion",
            subheadline:
                "Ask about symptoms, vaccines, nearby hospitals, or tailored wellness tips. Nirogi listens and responds in your preferred language.",
            quickSuggestions: [
                { label: "Outbreak Alerts", message: "What are the latest outbreak alerts?" },
                { label: "Nearby Hospitals", message: "Find nearby hospitals" },
                { label: "Preventive Tips", message: "Share preventive health tips" }
            ],
            initialMessage: "Hello! I am Nirogi, your AI health companion. How can I assist you today?",
            inputPlaceholder: "Ask about symptoms, vaccines, or health tips…",
            sendingIndicator: "Nirogi is thinking…",
            errorMessage: "Sorry, I'm having trouble connecting right now. Please try again."
        },
        dashboard: {
            title: "Health Intelligence Dashboard",
            subtitle:
                "Keep a finger on the pulse of community health. This dashboard unifies Nirogi's data services for quick oversight and proactive decision making.",
            highlights: [
                {
                    title: "Live COVID Trends",
                    description:
                        "Monitor real-time case counts, recovery rates, and vaccination progress across regions."
                },
                {
                    title: "Outbreak Alerts",
                    description:
                        "Track emerging outbreaks with localized insights pulled right from our health intelligence tools."
                },
                {
                    title: "Vaccine Schedules",
                    description: "Stay prepared with age-ready vaccine reminders and official immunization guidelines."
                }
            ],
            summaryTitle: "Today’s Snapshot",
            summaryStats: [
                {
                    label: "New COVID-19 Cases (24h)",
                    value: "1,254",
                    delta: "+3.2% vs last week"
                },
                {
                    label: "Vaccination Coverage",
                    value: "78%",
                    delta: "Population fully vaccinated in India"
                },
                {
                    label: "Hospital Bed Availability",
                    value: "82%",
                    delta: "Metro city average occupancy"
                }
            ],
            alertsTitle: "Active Outbreak Alerts",
            alerts: [
                {
                    title: "Dengue – Delhi NCR",
                    level: "High Alert",
                    description:
                        "152 cases reported this week. Fogging drives active in South Delhi. Use repellents and eliminate standing water."
                },
                {
                    title: "H3N2 Influenza – Bengaluru Urban",
                    level: "Watch",
                    description:
                        "42 respiratory clusters tracked in JP Nagar and Whitefield. Masks advised on public transport and crowded indoor events."
                }
            ],
            vaccinationTitle: "Free Government Vaccination Drives",
            vaccinationSubtitle: "Walk-in camps offering free immunisation — bring a valid photo ID and previous vaccination card, if available.",
            vaccinationDrives: [
                {
                    name: "Mega Immunisation Camp",
                    location: "AIIMS Community Centre, New Delhi",
                    schedule: "2 – 8 Nov 2025",
                    services: "COVID-19 booster (Covovax) · Influenza (Quadrivalent)"
                },
                {
                    name: "Pulse Polio Weekend",
                    location: "BBMP Ward Clinic, Indiranagar, Bengaluru",
                    schedule: "9 – 10 Nov 2025",
                    services: "Oral Polio Vaccine for children under 5"
                },
                {
                    name: "Maternal Health Drive",
                    location: "Civil Hospital, Sector 10, Chandigarh",
                    schedule: "Till 15 Nov 2025",
                    services: "TT Booster · Routine ANC vaccinations"
                }
            ],
            comingSoonTitle: "Coming Soon",
            comingSoonBody:
                "Plug in real analytics cards here — including sparkline charts, regional comparisons, and personalized alerts. The layout is ready for live data sourced from the Flask backend endpoints (/api/dashboard-data)."
        },
        about: {
            title: "About Nirogi",
            subtitle:
                "Nirogi blends modern AI with curated health data to make well-being insights approachable. Our mission is to empower people to take proactive action for themselves and their communities.",
            pillars: [
                {
                    title: "Human-Centred Design",
                    description:
                        "We partner with clinicians and public-health practitioners to design features that feel empathetic, contextual, and helpful."
                },
                {
                    title: "Evidence-Based Guidance",
                    description:
                        "Nirogi surfaces verified guidance and references data-backed services from the Flask backend to keep you informed with trustworthy insights."
                },
                {
                    title: "Inclusive Access",
                    description:
                        "Language support and localized datasets help communities everywhere gain access to timely information when it matters most."
                }
            ],
            foundationTitle: "What powers Nirogi?",
            foundationPoints: [
                "Flask API orchestrating Gemini responses with contextual health tools.",
                "Translation services that let you engage in the language you prefer.",
                "Local outbreak, vaccine schedule, and hospital datasets for resilience when third-party APIs are unreliable."
            ]
        }
    },
    hi: {
        meta: {
            label: "Hindi (हिंदी)"
        },
        nav: {
            home: "होम",
            chatbot: "चैटबोट",
            dashboard: "डैशबोर्ड",
            about: "हमारे बारे में"
        },
        home: {
            badge: "दुनिया भर के स्वास्थ्य खोजकर्ताओं का भरोसा",
            titlePrefix: "",
            titleHighlight: "निरोगी",
            titleSuffix: " के साथ रहें जागरूक, रहें स्वस्थ",
            subtitle:
                "रीयल-टाइम प्रकोप अलर्ट, व्यक्तिगत स्वास्थ्य सुझाव और आसपास की चिकित्सकीय सहायता — सब कुछ एक ही एआई साथी में।",
            ctaPrimary: "अभी चैटबोट आज़माएँ",
            ctaSecondary: "डैशबोर्ड देखें",
            missionTitle: "हमारा मिशन",
            missionBody:
                "हम समुदायों को भरोसेमंद और सुलभ स्वास्थ्य जानकारी से सशक्त बनाते हैं। निरोगी जटिल चिकित्सा डेटा को सरल मार्गदर्शन में बदलता है ताकि आप और आपका परिवार आत्मविश्वास से निर्णय ले सकें।",
            visionTitle: "स्वास्थ्य का वैश्विक दृष्टिकोण",
            visionBody:
                "स्थानीय प्रकोप अलर्ट से लेकर वैश्विक स्वास्थ्य रुझानों तक, हम वही संकेत जोड़ते हैं जो सबसे महत्वपूर्ण हैं। निरोगी बहुभाषी समर्थन देता है ताकि अधिक लोग समय पर स्वास्थ्य जानकारी प्राप्त कर सकें।"
        },
        chat: {
            headline: "निरोगी से बात करें – आपका एआई स्वास्थ्य साथी",
            subheadline:
                "लक्षण, टीकाकरण, नज़दीकी अस्पताल या व्यक्तिगत स्वास्थ्य सुझाव पूछें। निरोगी आपकी पसंदीदा भाषा में जवाब देता है।",
            quickSuggestions: [
                { label: "प्रकोप अलर्ट", message: "नवीनतम प्रकोप अलर्ट क्या हैं?" },
                { label: "नज़दीकी अस्पताल", message: "मेरे पास अस्पताल खोजें" },
                { label: "रोकथाम सुझाव", message: "स्वास्थ्य के लिए रोकथाम टिप्स बताइए" }
            ],
            initialMessage: "नमस्ते! मैं निरोगी हूँ, आपकी एआई स्वास्थ्य साथी। आज मैं आपकी किस प्रकार सहायता कर सकता हूँ?",
            inputPlaceholder: "लक्षण, टीकाकरण या स्वास्थ्य सुझावों के बारे में पूछें…",
            sendingIndicator: "निरोगी सोच रहा है…",
            errorMessage: "क्षमा करें, अभी कनेक्शन में समस्या है। कृपया दोबारा प्रयास करें।"
        },
        dashboard: {
            title: "स्वास्थ्य इंटेलिजेंस डैशबोर्ड",
            subtitle:
                "समुदाय के स्वास्थ्य पर नज़र रखें। यह डैशबोर्ड त्वरित निर्णयों के लिए निरोगी की डेटा सेवाओं को एक जगह प्रस्तुत करता है।",
            highlights: [
                {
                    title: "लाइव कोविड रुझान",
                    description:
                        "रीयल-टाइम में मामलों, रिकवरी दरों और टीकाकरण प्रगति की निगरानी करें।"
                },
                {
                    title: "प्रकोप अलर्ट",
                    description:
                        "हमारे स्वास्थ्य इंटेलिजेंस टूल से प्रत्यक्ष स्थानीयकृत अंतर्दृष्टि के साथ उभरते प्रकोपों को ट्रैक करें।"
                },
                {
                    title: "टीका अनुसूची",
                    description: "आयु-आधारित टीका अनुस्मारकों और आधिकारिक प्रतिरक्षण दिशानिर्देशों के साथ तैयार रहें।"
                }
            ],
            summaryTitle: "आज की झलक",
            summaryStats: [
                {
                    label: "नए कोविड-19 मामले (24 घंटे)",
                    value: "1,254",
                    delta: "+3.2% पिछले सप्ताह की तुलना में"
                },
                {
                    label: "टीकाकरण कवरेज",
                    value: "78%",
                    delta: "भारत में पूर्ण टीकाकृत आबादी"
                },
                {
                    label: "अस्पताल बिस्तर उपलब्धता",
                    value: "82%",
                    delta: "मेट्रो शहरों की औसत अधिभोग दर"
                }
            ],
            alertsTitle: "सक्रिय प्रकोप अलर्ट",
            alerts: [
                {
                    title: "डेंगू – दिल्ली एनसीआर",
                    level: "उच्च सतर्कता",
                    description:
                        "इस सप्ताह 152 मामले सामने आए। दक्षिण दिल्ली में फॉगिंग अभियान जारी। कृपया रेपेलेंट का उपयोग करें और जमा पानी हटाएँ।"
                },
                {
                    title: "एच3एन2 इन्फ्लुएंजा – बेंगलुरु शहरी",
                    level: "निगरानी",
                    description:
                        "जेपी नगर और व्हाइटफ़ील्ड में 42 श्वसन क्लस्टर। सार्वजनिक यातायात व भीड़भाड़ वाले स्थानों पर मास्क पहनने की सलाह।"
                }
            ],
            vaccinationTitle: "मुफ्त सरकारी टीकाकरण शिविर",
            vaccinationSubtitle: "नज़दीकी सत्र में सीधे पहुँचें — वैध फोटो आईडी और पुराना टीका कार्ड साथ लाएँ।",
            vaccinationDrives: [
                {
                    name: "मेगा इम्यूनाइज़ेशन कैंप",
                    location: "एम्स कम्युनिटी सेंटर, नई दिल्ली",
                    schedule: "2 – 8 नवम्बर 2025",
                    services: "कोविड-19 बूस्टर (कोवोवैक्स) · इन्फ्लूएंजा टेट्रा"
                },
                {
                    name: "पल्स पोलियो सप्ताहांत",
                    location: "बीबीएमपी वार्ड क्लिनिक, इंदिरानगर, बेंगलुरु",
                    schedule: "9 – 10 नवम्बर 2025",
                    services: "5 वर्ष से कम बच्चों के लिए मौखिक पोलियो वैक्सीन"
                },
                {
                    name: "मातृ स्वास्थ्य अभियान",
                    location: "सिविल अस्पताल, सेक्टर 10, चंडीगढ़",
                    schedule: "15 नवम्बर 2025 तक",
                    services: "टीटी बूस्टर · नियमित प्रसूता टीकाकरण"
                }
            ],
            comingSoonTitle: "जल्द आ रहा है",
            comingSoonBody:
                "यहाँ वास्तविक विश्लेषण कार्ड जोड़ें — स्पार्कलाइन चार्ट, क्षेत्रीय तुलना और व्यक्तिगत अलर्ट सहित। लेआउट फ़्लास्क बैकएंड एंडपॉइंट (\/api\/dashboard-data) से आने वाले लाइव डेटा के लिए तैयार है।"
        },
        about: {
            title: "निरोगी के बारे में",
            subtitle:
                "निरोगी आधुनिक एआई और चुने हुए स्वास्थ्य डेटा को मिलाकर स्वास्थ्य संबंधी जानकारी को सरल बनाता है। हमारा उद्देश्य है कि लोग स्वयं और अपने समुदाय के लिए सक्रिय कदम उठा सकें।",
            pillars: [
                {
                    title: "मानव-केंद्रित डिजाइन",
                    description:
                        "हम चिकित्सकों और सार्वजनिक स्वास्थ्य विशेषज्ञों के साथ मिलकर सहानुभूति से भरे और संदर्भित फीचर तैयार करते हैं।"
                },
                {
                    title: "साक्ष्य-आधारित मार्गदर्शन",
                    description:
                        "निरोगी सत्यापित मार्गदर्शन प्रदान करता है और विश्वसनीय जानकारी के लिए फ़्लास्क बैकएंड की डेटा सेवाओं का उपयोग करता है।"
                },
                {
                    title: "समावेशी पहुँच",
                    description:
                        "भाषा समर्थन और स्थानीयकृत डेटा सेट समुदायों को सही समय पर उपयोगी जानकारी प्राप्त करने में सहायता करते हैं।"
                }
            ],
            foundationTitle: "निरोगी की ताकत",
            foundationPoints: [
                "जेमिनी और स्वास्थ्य टूल के संदर्भों को जोड़ने वाला फ़्लास्क API।",
                "अनुवाद सेवाएँ जो आपको पसंदीदा भाषा में बातचीत करने देती हैं।",
                "स्थानीय प्रकोप, टीकाकरण अनुसूची और अस्पताल डेटा, जो बाहरी API विफल होने पर भी सहायक रहता है।"
            ]
        }
    }
};
