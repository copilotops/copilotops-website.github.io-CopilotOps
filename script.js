// Scroll Reveal Animation
window.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
});

// Chatbot Logic
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow.style.display === 'flex') {
        chatWindow.style.display = 'none';
    } else {
        chatWindow.style.display = 'flex';
    }
}

function handleQuickReply(type) {
    const chatBody = document.getElementById('chat-body');
    let botResponse = '';
    let scrollTarget = '';

    if (type === 'projects') {
        botResponse = "We've developed several real-world agents! Let me take you to our Architecture section.";
        scrollTarget = 'architecture';
    } else if (type === 'agentic') {
        botResponse = "Agentic AI acts autonomously to achieve complex goals. Check out our Core Capabilities!";
        scrollTarget = 'capabilities';
    }

    // Add user message visually
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message';
    userMsg.style.background = '#e3f2fd';
    userMsg.style.marginLeft = '20px';
    userMsg.innerText = type === 'projects' ? "What projects did you do?" : "Guide me through Agentic AI";
    chatBody.appendChild(userMsg);

    // Add bot response
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        botMsg.innerText = botResponse;
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Scroll to section
        document.getElementById(scrollTarget).scrollIntoView({ behavior: 'smooth' });
    }, 500);
}