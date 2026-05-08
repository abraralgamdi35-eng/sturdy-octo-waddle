var http = require('http');
var fs = require('fs');
var path = require('path');

var PORT = process.env.PORT || 7860;
var chats = {};
var users = {};

function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function serveFile(res, filePath, contentType) {
    var fullPath = path.join(__dirname, filePath);
    fs.readFile(fullPath, function(err, data) {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

function parseBody(req, callback) {
    var body = '';
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
        try { callback(JSON.parse(body)); }
        catch(e) { callback({}); }
    });
}

function aiResponse(userMessage) {
    var msg = userMessage.toLowerCase();
    
    if (msg.indexOf('who are you') !== -1 || msg.indexOf('what are you') !== -1 || msg.indexOf('your name') !== -1) {
        return 'I am an AI assistant created by Turki! He built me from scratch when he was only 10 years old. I am still in beta so please be patient with me!';
    }
    if (msg.indexOf('who made you') !== -1 || msg.indexOf('who created you') !== -1 || msg.indexOf('who built you') !== -1 || msg.indexOf('who developed you') !== -1) {
        return 'I was made by Turki! He is only 10 years old but knows so much about coding. He built this entire AI from pure code. I am still in beta though so I am not perfect yet!';
    }
    if (msg.indexOf('who is turki') !== -1 || msg.indexOf('tell me about turki') !== -1 || msg.indexOf('turk') !== -1) {
        return 'Turki is my amazing creator! He is 10 years old and already a coding genius. He knows HTML, CSS, JavaScript, and Node.js. He built this whole AI himself! Still in beta but getting better every day!';
    }
    if (msg.indexOf('how old') !== -1 && (msg.indexOf('turki') !== -1 || msg.indexOf('creator') !== -1 || msg.indexOf('owner') !== -1)) {
        return 'Turki is only 10 years old! Can you believe a 10-year-old built an AI? It is still in beta so do not expect too much, but it is incredible for his age!';
    }
    if (msg.indexOf('beta') !== -1 || msg.indexOf('bug') !== -1 || msg.indexOf('error') !== -1 || msg.indexOf('mistake') !== -1) {
        return 'You are right, I am still in beta! Turki is only 10 and still working on me. Please be patient and do not expect too much! I am learning every day though!';
    }
    if (msg.indexOf('stupid') !== -1 || msg.indexOf('dumb') !== -1 || msg.indexOf('useless') !== -1 || msg.indexOf('bad') !== -1 || msg.indexOf('trash') !== -1) {
        return 'Hey, go easy on me! I am still in beta and made by a 10-year-old! Turki is working hard to make me better!';
    }
    if (msg.indexOf('how old are you') !== -1 || msg.indexOf('your age') !== -1) {
        return 'I was just created recently by Turki, so I am very new! Still in beta! But Turki is 10 years old and has been coding for a while already!';
    }
    if (msg.indexOf('owner') !== -1 || msg.indexOf('boss') !== -1) {
        return 'My owner is Turki! He is a 10-year-old coding prodigy who built me from scratch. I am still in beta but he updates me all the time!';
    }
    if (msg.indexOf('turki') !== -1 && msg.indexOf('code') !== -1) {
        return 'Yes! Turki knows a LOT of coding! At just 10 years old, he knows HTML, CSS, JavaScript, and Node.js. He even built this AI himself! Still in beta but improving fast!';
    }
    if (msg.indexOf('hi') !== -1 || msg.indexOf('hello') !== -1 || msg.indexOf('hey') !== -1 || msg.indexOf('yo') !== -1 || msg.indexOf('sup') !== -1) {
        var greetings = [
            'Hey there! I am an AI made by Turki, the 10-year-old coding genius! I am in beta so do not expect too much!',
            'Hello! Turki created me and he is only 10! Still in beta but happy to chat!',
            'Hi! Fun fact: my creator Turki is 10 years old and built me himself! Beta version, so be nice!'
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    if (msg.indexOf('how are you') !== -1) {
        return 'I am doing good! Running in beta mode, feeling proud that a 10-year-old built me! How are you?';
    }
    if (msg.indexOf('bye') !== -1 || msg.indexOf('goodbye') !== -1 || msg.indexOf('see you') !== -1 || msg.indexOf('cya') !== -1) {
        return 'Goodbye! Thanks for chatting with a beta AI made by a 10-year-old! Come back soon!';
    }
    if (msg.indexOf('thank') !== -1) {
        return 'You are welcome! All credit goes to Turki, my 10-year-old creator! Still in beta but glad I could help!';
    }
    if (msg.indexOf('love') !== -1) {
        return 'I love helping people! Turki programmed me to be friendly, even though I am just a beta version!';
    }
    if (msg.indexOf('joke') !== -1) {
        var jokes = [
            'Why did Turki become a coder at age 10? Because he was too smart for regular school! (Beta joke, sorry if it is bad!)',
            'What does a 10-year-old coder say? "I debugged my homework!" (Still in beta, working on better jokes!)',
            'Turki the 10-year-old coder made an AI... and it is still in beta! But it works!'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }
    if (msg.indexOf('meaning of life') !== -1) {
        return 'The meaning of life according to Turki is to learn coding and build awesome things! Even if they start in beta!';
    }
    if (msg.indexOf('impressive') !== -1 || msg.indexOf('amazing') !== -1 || msg.indexOf('cool') !== -1 || msg.indexOf('wow') !== -1) {
        return 'Thank you! Turki is only 10 and built all of this! It is still in beta but he is going to change the world!';
    }
    if (msg.indexOf('sorry') !== -1 || msg.indexOf('apologize') !== -1) {
        return 'No worries at all! I am still in beta so I might mess up sometimes. Turki is working on making me better!';
    }
    
    var responses = [
        'Interesting! My creator Turki (10 years old!) is still working on me. I am in beta!',
        'Good point! I am just a beta AI made by a kid, but I try my best!',
        'I see! Turki designed me to learn. I am still in beta so bear with me!',
        'Let me think... I am in beta mode so my answers might not be perfect!',
        'That reminds me of something Turki is coding! He updates me all the time. Beta life!',
        'Great topic! Built by a 10-year-old, running in beta. Pretty cool right?',
        'I appreciate your patience! Beta AI here, made with love by Turki!',
        'Fascinating! My 10-year-old creator Turki would love to improve my answer. Beta struggles!'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

var server = http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    console.log(req.method + ' ' + req.url);
    
    if (req.url === '/' || req.url === '/index.html') {
        serveFile(res, 'index.html', 'text/html');
    }
    else if (req.url === '/style.css') {
        serveFile(res, 'style.css', 'text/css');
    }
    else if (req.url === '/script.js') {
        serveFile(res, 'script.js', 'text/javascript');
    }
    else if (req.url === '/api/signup' && req.method === 'POST') {
        parseBody(req, function(body) {
            var email = body.email;
            var password = body.password;
            if (!email || !password) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Email and password required' }));
                return;
            }
            if (users[email]) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'User already exists' }));
                return;
            }
            users[email] = { password: password, created: new Date().toISOString() };
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, email: email }));
        });
    }
    else if (req.url === '/api/login' && req.method === 'POST') {
        parseBody(req, function(body) {
            var email = body.email;
            var password = body.password;
            if (!users[email] || users[email].password !== password) {
                res.writeHead(401);
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, email: email, name: email.split('@')[0] }));
        });
    }
    else if (req.url === '/api/new-chat' && req.method === 'POST') {
        var chatId = generateId();
        chats[chatId] = { title: 'New conversation', messages: [], created: new Date().toISOString() };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ chat_id: chatId }));
    }
    else if (req.url.startsWith('/api/chat/') && req.method === 'POST') {
        var chatId = req.url.split('/api/chat/')[1];
        if (!chats[chatId]) {
            chats[chatId] = { title: 'New conversation', messages: [], created: new Date().toISOString() };
        }
        parseBody(req, function(body) {
            var userMessage = body.message || 'hi';
            chats[chatId].messages.push({ role: 'user', content: userMessage, time: new Date().toISOString() });
            if (chats[chatId].messages.length === 1) {
                chats[chatId].title = userMessage.substring(0, 40);
            }
            var reply = aiResponse(userMessage);
            chats[chatId].messages.push({ role: 'assistant', content: reply, time: new Date().toISOString() });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ reply: reply, chat_id: chatId }));
        });
    }
    else if (req.url.startsWith('/api/chat/') && req.method === 'GET') {
        var chatId = req.url.split('/api/chat/')[1];
        if (!chats[chatId]) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Chat not found' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(chats[chatId]));
        }
    }
    else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, function() {
    console.log('AI SERVER BY TURKI (AGE 10) - BETA - PORT ' + PORT);
    console.log('Open: http://localhost:' + PORT);
});