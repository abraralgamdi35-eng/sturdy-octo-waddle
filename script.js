var chatMessages = document.getElementById('chatMessages');
var chatScreen = document.getElementById('chatScreen');
var welcomeScreen = document.getElementById('welcomeScreen');
var userInput = document.getElementById('userInput');
var sendBtn = document.getElementById('sendBtn');
var newChatBtn = document.getElementById('newChatBtn');

var OLLAMA_URL = 'http://localhost:11434/api/chat';
var conversation = [];

function addMessage(text, sender) {
    var row = document.createElement('div');
    row.className = 'message-row ' + sender;
    
    var avatar = document.createElement('div');
    avatar.className = 'avatar ' + (sender === 'user' ? 'user-avatar' : 'bot-avatar');
    avatar.textContent = sender === 'user' ? 'U' : 'AI';
    
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    
    if (sender === 'user') {
        row.appendChild(bubble);
        row.appendChild(avatar);
    } else {
        row.appendChild(avatar);
        row.appendChild(bubble);
    }
    
    chatMessages.appendChild(row);
    chatMessages.parentElement.scrollTop = chatMessages.parentElement.scrollHeight;
}

async function sendToOllama(userMessage) {
    conversation.push({ role: 'user', content: userMessage });
    
    try {
        var response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2:1b',
                messages: conversation,
                stream: false
            })
        });
        
        if (!response.ok) throw new Error('Ollama not responding');
        
        var data = await response.json();
        var reply = data.message.content;
        conversation.push({ role: 'assistant', content: reply });
        return reply;
        
    } catch (error) {
        return 'hey! make sure Ollama is running! open terminal and type: ollama serve';
    }
}

async function sendMessage() {
    var text = userInput.value.trim();
    if (text === '') return;
    
    if (welcomeScreen.classList.contains('hidden') === false) {
        welcomeScreen.classList.add('hidden');
        chatScreen.classList.add('active');
    }
    
    addMessage(text, 'user');
    userInput.value = '';
    sendBtn.disabled = true;
    
    var thinkingRow = document.createElement('div');
    thinkingRow.className = 'message-row bot';
    var thinkingAvatar = document.createElement('div');
    thinkingAvatar.className = 'avatar bot-avatar';
    thinkingAvatar.textContent = 'AI';
    var thinkingBubble = document.createElement('div');
    thinkingBubble.className = 'message-bubble';
    thinkingBubble.style.opacity = '0.5';
    thinkingBubble.textContent = 'thinking...';
    thinkingRow.appendChild(thinkingAvatar);
    thinkingRow.appendChild(thinkingBubble);
    chatMessages.appendChild(thinkingRow);
    chatMessages.parentElement.scrollTop = chatMessages.parentElement.scrollHeight;
    
    var reply = await sendToOllama(text);
    
    thinkingRow.remove();
    addMessage(reply, 'bot');
    sendBtn.disabled = false;
    userInput.focus();
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

newChatBtn.addEventListener('click', function() {
    conversation = [];
    chatMessages.innerHTML = '';
    welcomeScreen.classList.remove('hidden');
    chatScreen.classList.remove('active');
    userInput.value = '';
});