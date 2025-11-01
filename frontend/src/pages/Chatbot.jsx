import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Send, Loader2, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "../context/LanguageContext.jsx";

const rawApiBase = import.meta.env.VITE_API_BASE_URL || "";
const API_BASE_URL = rawApiBase.replace(/\/$/, "");

function Chatbot() {
    const { language, dictionary } = useLanguage();
    const chatContent = dictionary.chat;

    const [messages, setMessages] = useState(() => [
        {
            id: "welcome",
            role: "bot",
            text: chatContent.initialMessage
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [chatContext, setChatContext] = useState(null);
    const [showQuickSuggestions, setShowQuickSuggestions] = useState(true);
    const scrollAnchorRef = useRef(null);

    const chatEndpoint = API_BASE_URL ? `${API_BASE_URL}/api/chat` : "/api/chat";

    useEffect(() => {
        setMessages([
            {
                id: "welcome",
                role: "bot",
                text: dictionary.chat.initialMessage
            }
        ]);
        setChatContext(null);
        setInputValue("");
        setShowQuickSuggestions(true);
    }, [dictionary.chat.initialMessage]);

    const sendMessage = useCallback(
        async (messageText) => {
            const trimmed = messageText.trim();
            if (!trimmed || isSending) {
                return;
            }

            const userMessage = {
                id: crypto.randomUUID(),
                role: "user",
                text: trimmed
            };

            setMessages((prev) => [...prev, userMessage]);
            setShowQuickSuggestions(false);
            setInputValue("");
            setIsSending(true);

            try {
                const response = await fetch(chatEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: trimmed,
                        context: chatContext,
                        language
                    })
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const data = await response.json();
                const botMessage = {
                    id: crypto.randomUUID(),
                    role: "bot",
                    text: data.message
                };

                setMessages((prev) => [...prev, botMessage]);
                setChatContext(data.metadata?.context ?? null);
            } catch (error) {
                console.error("Error sending message", error);
                setMessages((prev) => [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        role: "bot",
                        text: dictionary.chat.errorMessage
                    }
                ]);
            } finally {
                setIsSending(false);
                queueMicrotask(() => {
                    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
                });
            }
        },
        [chatEndpoint, chatContext, dictionary.chat.errorMessage, isSending, language]
    );

    const handleSend = useCallback(
        (event) => {
            event.preventDefault();
            void sendMessage(inputValue);
        },
        [inputValue, sendMessage]
    );

    const handleSuggestionClick = useCallback(
        (messageText) => {
            void sendMessage(messageText);
        },
        [sendMessage]
    );

    return (
        <section className="animate-fade-in">
            <header className="mx-auto max-w-3xl text-center space-y-3">
                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{chatContent.headline}</h1>
                <p className="text-base text-gray-600 md:text-lg">{chatContent.subheadline}</p>
            </header>

            <div className="mx-auto mt-10 max-w-4xl rounded-3xl bg-chat-gradient p-4 shadow-soft md:p-8">
                <div className="flex h-[70vh] flex-col justify-between rounded-2xl bg-white/80 p-4 backdrop-blur-sm md:p-6">
                    <div className="flex flex-col gap-4 overflow-y-auto pr-1" role="log" aria-live="polite">
                        {showQuickSuggestions ? (
                            <div className="flex flex-wrap justify-center gap-2">
                                {chatContent.quickSuggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.label}
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestion.message)}
                                        className="bg-white border border-green-100 px-4 py-2 rounded-full text-sm text-gray-600 shadow-sm hover:bg-green-50 hover:text-green-700 transition"
                                    >
                                        {suggestion.label}
                                    </button>
                                ))}
                            </div>
                        ) : null}

                        {messages.map((message) => (
                            <MessageBubble key={message.id} role={message.role} text={message.text} />
                        ))}

                        {isSending ? (
                            <div
                                className="flex items-center gap-2 text-sm text-green-700 animate-pulse"
                                aria-live="assertive"
                                aria-busy="true"
                            >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{chatContent.sendingIndicator}</span>
                            </div>
                        ) : null}
                        <span ref={scrollAnchorRef} aria-hidden="true" />
                    </div>

                    <form onSubmit={handleSend} className="sticky bottom-0 left-0 right-0 mt-6">
                        <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-md">
                            <MessageCircle className="hidden h-5 w-5 text-green-500 md:block" aria-hidden="true" />
                            <input
                                className="flex-grow bg-transparent px-1 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none md:text-base"
                                placeholder={chatContent.inputPlaceholder}
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                                aria-label="Message"
                            />
                            <button
                                type="submit"
                                disabled={isSending || !inputValue.trim()}
                                className="inline-flex items-center justify-center rounded-full bg-green-600 p-3 text-white shadow-glow transition-all hover:bg-green-700 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Send message"
                            >
                                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

function MessageBubble({ role, text }) {
    const isBot = role === "bot";

    return (
        <div
            className={clsx(
                "max-w-xl animate-fade-in rounded-2xl px-5 py-4 text-sm leading-relaxed md:text-base shadow-sm",
                isBot ? "self-start bg-green-50 text-green-900" : "self-end bg-gray-100 text-gray-700"
            )}
        >
            {isBot ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => (
                            <ul className="mb-2 ml-5 list-disc space-y-1 last:mb-0" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                            <ol className="mb-2 ml-5 list-decimal space-y-1 last:mb-0" {...props} />
                        ),
                        li: ({ node, ...props }) => <li className="marker:text-green-500" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        br: () => <br />
                    }}
                >
                    {text}
                </ReactMarkdown>
            ) : (
                <p className="mb-0">{text}</p>
            )}
        </div>
    );
}

export default Chatbot;
