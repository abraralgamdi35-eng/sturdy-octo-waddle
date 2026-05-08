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

function checkLogin() {
    var user = localStorage.getItem('myAiUser');
    if (user) {
        currentUser = JSON.parse(user);
        loginOverlay.classList.add('hidden');
        userName.textContent = currentUser.name || currentUser.email.split('@')[0];
        userAvatar.textContent = (currentUser.name || currentUser.email).charAt(0).toUpperCase();
        loadChats();
        newChat();
    }
}

function loginUser(email, name) {
    currentUser = { email: email, name: name || email.split('@')[0] };
    localStorage.setItem('myAiUser', JSON.stringify(currentUser));
    loginOverlay.classList.add('hidden');
    userName.textContent = currentUser.name;
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    loadChats();
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

signupBtn.onclick = async function() {
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();
    if (!email || !password) return alert('Fill all fields');
    try {
        var res = await fetch(BASE_URL + '/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });
        var data = await res.json();
        if (data.success) loginUser(email);
        else alert(data.error);
    } catch(e) { loginUser(email); }
};

loginBtn.onclick = async function() {
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();
    if (!email || !password) return alert('Fill all fields');
    try {
        var res = await fetch(BASE_URL + '/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });
        var data = await res.json();
        if (data.success) loginUser(email);
        else alert(data.error);
    } catch(e) { loginUser(email); }
};

logoutBtn.onclick = function() {
    localStorage.removeItem('myAiUser');
    currentUser = null;
    chatMessages.innerHTML = '';
    chatHistory.innerHTML = '';
    welcomeScreen.classList.remove('hidden');
    chatScreen.classList.remove('active');
    loginOverlay.classList.remove('hidden');
};

function loadChats() {
    var key = 'myChats_' + (currentUser ? currentUser.email : 'guest');
    var saved = localStorage.getItem(key);
    if (saved) {
        savedChats = JSON.parse(saved);
        Object.keys(savedChats).forEach(function(id) {
            addHistoryItem(id, savedChats[id].title);
        });
    }
}

function saveChats() {
    var key = 'myChats_' + (currentUser ? currentUser.email : 'guest');
    localStorage.setItem(key, JSON.stringify(savedChats));
}

function addHistoryItem(id, title) {
    var item = document.createElement('div');
    item.className = 'history-item';
    item.dataset.chatId = id;
    item.textContent = title || 'New conversation';
    item.onclick = function() { loadChat(id); };
    chatHistory.insertBefore(item, chatHistory.firstChild);
}

async function loadChat(id) {
    currentChatId = id;
    chatMessages.innerHTML = '';
    try {
        var res = await fetch(BASE_URL + '/api/chat/' + id);
        var data = await res.json();
        data.messages.forEach(function(msg) {
            addMessageToScreen(msg.content, msg.role === 'user' ? 'user' : 'bot');
        });
    } catch(e) {}
    welcomeScreen.classList.add('hidden');
    chatScreen.classList.add('active');
    document.querySelectorAll('.history-item').forEach(function(el) {
        el.classList.toggle('active', el.dataset.chatId === id);
    });
}

async function newChat() {
    try {
        var res = await fetch(BASE_URL + '/api/new-chat', { method: 'POST' });
        var data = await res.json();
        currentChatId = data.chat_id;
        savedChats[data.chat_id] = { title: 'New conversation' };
        saveChats();
        addHistoryItem(data.chat_id, 'New conversation');
        chatMessages.innerHTML = '';
        welcomeScreen.classList.remove('hidden');
        chatScreen.classList.remove('active');
    } catch(e) {}
}

function addMessageToScreen(text, sender) {
    var row = document.createElement('div');
    row.className = 'message-row ' + sender;
    var avatar = document.createElement('div');
    avatar.className = 'avatar ' + (sender === 'user' ? 'user-avatar' : 'bot-avatar');
    avatar.textContent = sender === 'user' ? (currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U') : 'T';
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    sender === 'user' ? row.append(bubble, avatar) : row.append(avatar, bubble);
    chatMessages.appendChild(row);
    chatScreen.scrollTop = chatScreen.scrollHeight;
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
        savedChats[currentChatId].title = text.substring(0, 30);
        saveChats();
        document.querySelectorAll('.history-item').forEach(function(el) {
            if (el.dataset.chatId === currentChatId) el.textContent = text.substring(0, 30);
        });
    } catch(e) {
        addMessageToScreen('Error: Server not running!', 'bot');
    }
    sendBtn.disabled = false;
    userInput.focus();
}

sendBtn.onclick = sendMessage;
newChatBtn.onclick = newChat;
userInput.onkeydown = function(e) {
    if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
};

checkLogin();
