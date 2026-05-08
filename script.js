var chatMessages = document.getElementById('chatMessages');
var chatScreen = document.getElementById('chatScreen');
var welcomeScreen = document.getElementById('welcomeScreen');
var userInput = document.getElementById('userInput');
var sendBtn = document.getElementById('sendBtn');
var newChatBtn = document.getElementById('newChatBtn');
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

var savedUser = localStorage.getItem('turkiAiUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showChat();
}

function loginUser(email, name) {
    currentUser = { email: email, name: name || email.split('@')[0] };
    localStorage.setItem('turkiAiUser', JSON.stringify(currentUser));
    loginModal.classList.remove('show');
    showChat();
}

function showChat() {
    welcomeScreen.classList.add('hidden');
    chatScreen.classList.add('active');
    newChat();
}

function addMessage(text, sender) {
    var div = document.createElement('div');
    div.className = 'message ' + sender;
    var avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? (currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U') : 'T';
    var bubble = document.createElement('div');
    bubble.className = 'message-text';
    bubble.textContent = text;
    if (sender === 'user') { div.append(bubble, avatar); }
    else { div.append(avatar, bubble); }
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
        addMessage('Error connecting to TurkiAI server', 'bot');
    }
    sendBtn.disabled = false;
    userInput.focus();
}

if (showLoginBtn) showLoginBtn.onclick = function() { loginModal.classList.add('show'); };
if (closeModal) closeModal.onclick = function() { loginModal.classList.remove('show'); };
if (googleLoginBtn) googleLoginBtn.onclick = function() {
    var name = prompt('Enter your name:');
    var email = prompt('Enter your Gmail:');
    if (email && name) {
        if (!email.includes('@')) email += '@gmail.com';
        loginUser(email, name);
    }
};
if (loginBtn) loginBtn.onclick = function() {
    var email = emailInput.value.trim();
    if (!email) return;
    loginUser(email);
};
if (signupBtn) signupBtn.onclick = function() {
    var email = emailInput.value.trim();
    if (!email) return;
    loginUser(email);
};
if (sendBtn) sendBtn.onclick = sendMessage;
if (newChatBtn) newChatBtn.onclick = function() { chatMessages.innerHTML = ''; newChat(); };
if (userInput) userInput.onkeydown = function(e) { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } };
