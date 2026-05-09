var welcomeScreen = document.getElementById('welcomeScreen');
var chatScreen = document.getElementById('chatScreen');
var chatMessages = document.getElementById('chatMessages');
var userInput = document.getElementById('userInput');
var sendBtn = document.getElementById('sendBtn');
var newChatBtn = document.getElementById('newChatBtn');
var loginBox = document.getElementById('loginBox');
var loginBtn = document.getElementById('loginBtn');
var googleBtn = document.getElementById('googleBtn');
var emailLoginBtn = document.getElementById('emailLoginBtn');
var closeLoginBtn = document.getElementById('closeLoginBtn');
var emailInput = document.getElementById('emailInput');

var BASE_URL = 'https://sturdy-octo-waddle-3.onrender.com';
var currentChatId = '';
var currentUser = null;
var guestMessages = 0;
var MAX_GUEST_MESSAGES = 3;

var saved = localStorage.getItem('turkiUser');
if (saved) {
    currentUser = JSON.parse(saved);
    showApp();
}

function showApp() {
    welcomeScreen.style.display = 'none';
    chatScreen.style.display = 'flex';
    newChat();
}

function login(email, name) {
    currentUser = { email: email, name: name || email.split('@')[0] };
    localStorage.setItem('turkiUser', JSON.stringify(currentUser));
    loginBox.style.display = 'none';
    guestMessages = 0;
    showApp();
    addMsg('Welcome ' + currentUser.name + '! You now have unlimited messages! 🎉', 'bot');
}

loginBtn.onclick = function() { loginBox.style.display = 'flex'; };
closeLoginBtn.onclick = function() { loginBox.style.display = 'none'; };

googleBtn.onclick = function() {
    var name = prompt('Your name:');
    var email = prompt('Your email:');
    if (email && name) login(email, name);
};

emailLoginBtn.onclick = function() {
    var email = emailInput.value.trim();
    if (email) login(email);
};

function addMsg(text, sender) {
    var d = document.createElement('div');
    d.className = 'message ' + sender;
    var b = document.createElement('div');
    b.className = 'msg-bubble ' + sender;
    b.textContent = text;
    d.appendChild(b);
    chatMessages.appendChild(d);
    chatScreen.scrollTop = chatScreen.scrollHeight;
}

async function newChat() {
    try {
        var r = await fetch(BASE_URL + '/api/new-chat', { method: 'POST' });
        var d = await r.json();
        currentChatId = d.chat_id;
    } catch(e) {}
}

async function sendMsg() {
    var text = userInput.value.trim();
    if (!text) return;
    
    if (!currentUser) {
        guestMessages++;
        if (guestMessages > MAX_GUEST_MESSAGES) {
            addMsg('You have used all ' + MAX_GUEST_MESSAGES + ' free messages! Please log in or sign up to continue chatting. 🙏', 'bot');
            addMsg('Click the Log in button below to get unlimited messages!', 'bot');
            userInput.value = '';
            userInput.disabled = true;
            sendBtn.disabled = true;
            return;
        }
        if (guestMessages === MAX_GUEST_MESSAGES) {
            addMsg('⚠️ This is your last free message! Log in or sign up for unlimited chats!', 'bot');
        }
    }
    
    addMsg(text, 'user');
    userInput.value = '';
    
    try {
        var r = await fetch(BASE_URL + '/api/chat/' + currentChatId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        var d = await r.json();
        addMsg(d.reply, 'bot');
    } catch(e) {
        addMsg('Error: Server may be sleeping. Try again!', 'bot');
    }
}

sendBtn.onclick = sendMsg;
newChatBtn.onclick = function() { 
    chatMessages.innerHTML = ''; 
    newChat();
    if (!currentUser) {
        guestMessages = 0;
        userInput.disabled = false;
        sendBtn.disabled = false;
        addMsg('You have ' + MAX_GUEST_MESSAGES + ' free messages. Log in for unlimited! 🔓', 'bot');
    }
};
userInput.onkeydown = function(e) { if (e.key === 'Enter') sendMsg(); };

if (!currentUser) {
    addMsg('Welcome! You have ' + MAX_GUEST_MESSAGES + ' free messages. Log in for unlimited! 🔓', 'bot');
}
