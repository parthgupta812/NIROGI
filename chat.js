document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message-input");
    const chatWindow = document.getElementById("chat-window");
    const languageSelect = document.getElementById("language");
    const quickButtonsContainer = document.getElementById("quick-buttons-container");
    const sendButton = document.getElementById("send-button");

    const API_URL = "http://127.0.0.1:5000/api/chat";

    // This is the "Context Awareness" (Checklist VI)
    // It remembers what the bot just asked the user.
    let chatContext = null;

    // Handle form submission
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (!message) return;
        sendMessage(message);
    });

    // Handle Quick Button clicks
    quickButtonsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("quick-btn")) {
            const message = event.target.getAttribute("data-message");
            sendMessage(message);
        }
    });

    async function sendMessage(message) {
        const language = languageSelect.value;

        // Hide quick buttons after first interaction
        if (quickButtonsContainer) {
            quickButtonsContainer.classList.add("hidden");
        }

        addMessageToChat(message, "user-message");
        messageInput.value = "";
        sendButton.disabled = true;

        showTypingIndicator();

        try {
            // This fetch is now sending the context
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: message,
                    language: language,
                    context: chatContext // Send the current context
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            const data = await response.json();

            hideTypingIndicator();
            addMessageToChat(data.message, "bot-message");

            // CRITICAL: Update the context for the *next* message
            if (data.metadata && data.metadata.context) {
                chatContext = data.metadata.context;
            } else {
                // If no context is returned, clear it.
                chatContext = null;
            }

        } catch (error) {
            console.error("Error:", error);
            hideTypingIndicator();
            addMessageToChat("Sorry, I'm having trouble connecting. Please try again.", "bot-message");
        } finally {
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    function addMessageToChat(message, className) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", className, "animate-slide-in");

        if (className === "bot-message") {
            messageElement.classList.add("message-with-avatar");
            const avatar = document.createElement("div");
            avatar.classList.add("bot-avatar");
            avatar.setAttribute("aria-hidden", "true");
            messageElement.appendChild(avatar);
        }

        const messageCopy = document.createElement("p");
        messageCopy.classList.add("message-copy");
        messageCopy.innerText = message;
        messageElement.appendChild(messageCopy);

        chatWindow.appendChild(messageElement);
        messageElement.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    function showTypingIndicator() {
        const indicator = document.createElement("div");
        indicator.classList.add("message", "bot-message", "typing-indicator");
        indicator.innerHTML = "<span></span><span></span><span></span>";
        indicator.id = "typing-indicator";
        chatWindow.appendChild(indicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById("typing-indicator");
        if (indicator) {
            chatWindow.removeChild(indicator);
        }
    }
});