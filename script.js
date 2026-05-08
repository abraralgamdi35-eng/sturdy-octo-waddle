var chatMessages = document.getElementById('chatMessages');
var chatScreen = document.getElementById('chatScreen');
var welcomeScreen = document.getElementById('welcomeScreen');
var userInput = document.getElementById('userInput');
var sendBtn = document.getElementById('sendBtn');
var newChatBtn = document.getElementById('newChatBtn');
var chatHistory = document.getElementById('chatHistory');
var loginOverlay = document.getElementById('loginOverlay');
var googleLoginBtn = document.getElementById('googleLoginBtn');
var loginBtn = document.getElementById('loginBtn');
var signupBtn = document.getElementById('signupBtn');
var logoutBtn = document.getElementById('logoutBtn');
var emailInput = document.getElementById('emailInput');
var passwordInput = document.getElementById('passwordInput');
var userName = document.getElementById('userName');
var userAvatar = document.getElementById('userAvatar');

var BASE_URL = 'https://sturdy-octo-waddle-3.onrender.com';
var currentChatId = '';
var currentUser = null;
var savedChats = {};

var user = localStorage.getItem('myAiUser');
if (user) {
    currentUser = JSON.parse(user);
    loginOverlay.classList.add('hidden');
    userName.textContent = currentUser.name || currentUser.email.split('@')[0];
    userAvatar.textContent = (currentUser.name || currentUser.email).charAt(0).toUpperCase();
    newChat();
}

function loginUser(email, name) {
    currentUser = { email: email, name: name || email.split('@')[0] };
    localStorage.setItem('myAiUser', JSON.stringify(currentUser));
    loginOverlay.classList.add('hidden');
    userName.textContent = currentUser.name;
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    newChat();
}

googleLoginBtn.onclick = function() {
    var name = prompt('Enter your name:');
    var email = prompt('Enter your Gmail:');
    if (email && name) {
        if (!email.includes('@')) email += '@gmail.com';
        loginUser(email, name);
    }
};

signupBtn.onclick = function() {
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();
    if (!email || !password) { alert('Fill all fields'); return; }
    loginUser(email);
};

loginBtn.onclick = function() {
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();
    if (!email || !password) { alert('Fill all fields'); return; }
    loginUser(email);
};

logoutBtn.onclick = function() {
    localStorage.removeItem('myAiUser');
    location.reload();
};

function addMessageToScreen(text, sender) {
    var row = document.createElement('div');
    row.className = 'message-row ' + sender;
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    var label = document.createElement('div');
    label.style.fontSize = '11px';
    label.style.color = '#888';
    label.style.marginBottom = '4px';
    label.textContent = sender === 'user' ? (currentUser ? currentUser.name : 'You') : 'AI';
    if (sender === 'user') {
        row.style.justifyContent = 'flex-end';
        row.append(bubble, label);
    } else {
        row.style.justifyContent = 'flex-start';
        row.append(label, bubble);
    }
    chatMessages.appendChild(row);
    chatScreen.scrollTop = chatScreen.scrollHeight;
}

async function newChat() {
    try {
        var res = await fetch(BASE_URL + '/api/new-chat', { method: 'POST' });
        var data = await res.json();
        currentChatId = data.chat_id;
        welcomeScreen.classList.remove('hidden');
        chatScreen.classList.remove('active');
        chatMessages.innerHTML = '';
    } catch(e) {}
}

async function sendMessage() {
    var text = userInput.value.trim();
    if (!text || !currentUser) return;
    if (!currentChatId) await newChat();
    welcomeScreen.classList.add('hidden');
    chatScreen.classList.add('active');
    addMessageToScreen(text, 'user');
    userInput.value = '';
    sendBtn.disabled = true;
    try {
        var res = await fetch(BASE_URL + '/api/chat/' + currentChatId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        var data = await res.json();
        addMessageToScreen(data.reply, 'bot');
    } catch(e) {
        addMessageToScreen('Error: Could not reach server', 'bot');
    }
    sendBtn.disabled = false;
    userInput.focus();
}

sendBtn.onclick = sendMessage;
newChatBtn.onclick = newChat;
userInput.onkeydown = function(e) {
    if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
};
