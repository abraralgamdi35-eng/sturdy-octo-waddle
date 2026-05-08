var chatMessages = document.getElementById('chatMessages');
var chatScreen = document.getElementById('chatScreen');
var welcomeScreen = document.getElementById('welcomeScreen');
var userInput = document.getElementById('userInput');
var sendBtn = document.getElementById('sendBtn');
var newChatBtn = document.getElementById('newChatBtn');
var chatHistory = document.getElementById('chatHistory');
var loginModal = document.getElementById('loginModal');
var showLoginBtn = document.getElementById('showLoginBtn');
var closeModal = document.getElementById('closeModal');
var googleLoginBtn = document.getElementById('googleLoginBtn');
var loginBtn = document.getElementById('loginBtn');
var signupBtn = document.getElementById('signupBtn');
var emailInput = document.getElementById('emailInput');
var passwordInput = document.getElementById('passwordInput');

var BASE_URL = 'https://sturdy-octo-waddle-3.onrender.com';
var currentChatId = '';
var currentUser = null;

var savedUser = localStorage.getItem('myAiUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showChat();
}

showLoginBtn.onclick = function() { loginModal.classList.add('show'); };
closeModal.onclick = function() { loginModal.classList.remove('show'); };

function loginUser(email, name) {
    currentUser = { email: email, name: name || email.split('@')[0] };
    localStorage.setItem('myAiUser', JSON.stringify(currentUser));
    loginModal.classList.remove('show');
    showChat();
}

function showChat() {
    welcomeScreen.classList.add('hidden');
    chatScreen.classList.add('active');
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

loginBtn.onclick = function() {
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();
    if (!email || !password) return;
    loginUser(email);
};

signupBtn.onclick = function() {
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();
    if (!email || !password) return;
    loginUser(email);
};

function addMessage(text, sender) {
    var div = document.createElement('div');
    div.className = 'message ' + sender;
    var avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? (currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U') : 'AI';
    var bubble = document.createElement('div');
    bubble.className = 'message-text';
    bubble.textContent = text;
    sender === 'user' ? div.append(bubble, avatar) : div.append(avatar, bubble);
    chatMessages.appendChild(div);
    chatScreen.scrollTop = chatScreen.scrollHeight;
}

async function newChat() {
    try {
        var res = await fetch(BASE_URL + '/api/new-chat', { method: 'POST' });
        var data = await res.json();
        currentChatId = data.chat_id;
    } catch(e) {}
}

async function sendMessage() {
    var text = userInput.value.trim();
    if (!text || !currentUser) return;
    addMessage(text, 'user');
    userInput.value = '';
    sendBtn.disabled = true;
    try {
        var res = await fetch(BASE_URL + '/api/chat/' + currentChatId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        var data = await res.json();
        addMessage(data.reply, 'bot');
    } catch(e) {
        addMessage('Error connecting to server', 'bot');
    }
    sendBtn.disabled = false;
    userInput.focus();
}

sendBtn.onclick = sendMessage;
newChatBtn.onclick = function() { chatMessages.innerHTML = ''; newChat(); };
userInput.onkeydown = function(e) { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } };
