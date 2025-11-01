/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "brand-green": "#16a34a",
                "brand-green-dark": "#15803d",
                "brand-surface": "#f5fbf7"
            },
            boxShadow: {
                navbar: "0 10px 30px -12px rgba(22, 163, 74, 0.35)",
                soft: "0 20px 45px -24px rgba(15, 118, 110, 0.45)",
                glow: "0 0 0 3px rgba(22, 163, 74, 0.25)"
            },
            backgroundImage: {
                "hero-gradient": "linear-gradient(180deg, rgba(240,253,244,1) 0%, rgba(255,255,255,1) 100%)",
                "chat-gradient": "linear-gradient(135deg, rgba(226,252,231,1) 0%, rgba(239,246,255,1) 100%)"
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: "0", transform: "translateY(8px)" },
                    to: { opacity: "1", transform: "translateY(0)" }
                },
                slideInUp: {
                    from: { opacity: "0", transform: "translateY(14px)" },
                    to: { opacity: "1", transform: "translateY(0)" }
                }
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-in": "slideInUp 0.35s ease-out"
            },
            fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system"]
            }
        }
    },
    plugins: []
};
