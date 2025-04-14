const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const intialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
    const themecolor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themecolor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>ChatGPT Clone</h1>
                            <p>Start a Conversation and explore the Clone version.<br> Your chat history will be displayed here.</p>
                            <h2>(Made by Thanneeru Ritwik 2451-22-737-161)</h2>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalstorage()

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const getChatResponse = (inputText) => {
    const responses = {
        "hello": "Hi there! How can I help you today?",
        "hi": "Hello! Need any help?",
        "how are you": "I'm just a bot, but I'm doing great! What about you?",
        "bye": "Goodbye! Have a great day!",
        "who are you": "I'm a ChatGPT clone created by Thanneeru Ritwik!",
        "thank you": "You're welcome!",
        "who created you": "I was created by Thanneeru Ritwik (2451-22-737-161).",
        "what is javascript": "JavaScript is a programming language commonly used to create interactive effects within web browsers.",
        "write hello world program in c++": `Here's a simple C++ Hello World program:\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}`,
        "what is html": "HTML stands for HyperText Markup Language. It is used to create the structure of web pages."
    };

    return responses[inputText.toLowerCase()] || "Sorry, I didn't understand that. Can you rephrase?";
}


const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.closest(".chat-content").querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent)
        .then(() => {
            copyBtn.textContent = "done";
            setTimeout(() => copyBtn.textContent = "content_copy", 1000);
        })
        .catch((err) => {
            console.error("Failed to copy text: ", err);
        });
}

const showTypingAnimation = () => {
    const typingHTML = `<div class="chat-content">
        <div class="chat-details">
            <img src="images/chatbot.jpg" alt="chatbot-img">
            <div class="typing-animation">
                <div class="typing-dot" style="--delay: 0.2s"></div>
                <div class="typing-dot" style="--delay: 0.3s"></div>
                <div class="typing-dot" style="--delay: 0.4s"></div>
            </div>
        </div>
        <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
    </div>`;

    const incomingChatDiv = createElement(typingHTML, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    setTimeout(() => {
        const responseText = getChatResponse(userText);
        incomingChatDiv.querySelector(".chat-content").innerHTML = `
            <div class="chat-details">
                <img src="images/chatbot.jpg" alt="chatbot-img">
                <p>${responseText}</p>
            </div>
            <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
        `;
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
        localStorage.setItem("all-chats", chatContainer.innerHTML);
    }, 1000);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (userText === "") return;

    chatInput.value = "";
    chatInput.style.height = `${intialHeight}px`

    const userHTML = `<div class="chat-content">
        <div class="chat-details">
            <img src="images/user.jpg" alt="user-img">
            <p>${userText}</p>
        </div>
    </div>`;
    
    const outgoingChatDiv = createElement(userHTML, "outgoing");
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500); 
    chatInput.value = ""; 
}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

deleteButton.addEventListener("click", () => {
    if(confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
})

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${intialHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);
