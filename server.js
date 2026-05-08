var http = require('http');
var fs = require('fs');
var path = require('path');

var PORT = process.env.PORT || 10000;
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
    if (msg.indexOf('who made you') !== -1 || msg.indexOf('who created you') !== -1 || msg.indexOf('who built you') !== -1) {
        return 'I was made by Turki! He is only 10 years old but knows so much about coding. He built this entire AI from pure code. Still in beta!';
    }
    if (msg.indexOf('turki') !== -1) {
        return 'Turki is my creator! He is a 10-year-old coding genius who built this AI from scratch. He knows HTML, CSS, JavaScript, and Node.js. A true prodigy!';
    }
    if (msg.indexOf('beta') !== -1 || msg.indexOf('bug') !== -1 || msg.indexOf('error') !== -1 || msg.indexOf('mistake') !== -1) {
        return 'You are right, I am still in beta! Turki is only 10 and still working on me. Please be patient!';
    }
    if (msg.indexOf('stupid') !== -1 || msg.indexOf('dumb') !== -1 || msg.indexOf('useless') !== -1 || msg.indexOf('bad') !== -1 || msg.indexOf('trash') !== -1) {
        return 'Hey, go easy on me! I am still in beta and made by a 10-year-old! Turki is working hard to make me better!';
    }
    if (msg.indexOf('hi') !== -1 || msg.indexOf('hello') !== -1 || msg.indexOf('hey') !== -1 || msg.indexOf('yo') !== -1 || msg.indexOf('sup') !== -1) {
        var greetings = ['Hey there! I am an AI made by Turki, the 10-year-old coding genius!', 'Hello! Turki created me and he is only 10!', 'Hi! Fun fact: my creator Turki is 10 years old and built me himself!'];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    if (msg.indexOf('spanish') !== -1 || msg.indexOf('espanol') !== -1) { return 'Hola! Soy una IA creada por Turki, un genio de la programacion de 10 anos! Estoy en beta!'; }
    if (msg.indexOf('french') !== -1 || msg.indexOf('francais') !== -1) { return 'Bonjour! Je suis une IA creee par Turki, un genie du code de 10 ans! Je suis en beta!'; }
    if (msg.indexOf('arabic') !== -1 || msg.indexOf('arabi') !== -1) { return '! مرحبا! أنا ذكاء اصطناعي صنعه تركي، عبقري البرمجة البالغ من العمر 10 سنوات! لا أزال في النسخة التجريبية'; }
    if (msg.indexOf('german') !== -1 || msg.indexOf('deutsch') !== -1) { return 'Hallo! Ich bin eine KI, die von Turki, einem 10-jahrigen Programmiergenie, erstellt wurde! Noch in der Beta!'; }
    if (msg.indexOf('hindi') !== -1) { return 'Namaste! Main Turki dwara banaya gaya AI hoon, jo 10 saal ka coding genius hai! Beta mein hoon!'; }
    if (msg.indexOf('japanese') !== -1 || msg.indexOf('nihongo') !== -1) { return 'Konnichiwa! Watashi wa 10-sai no kodingu tensai Turki ga tsukutta AI desu! Beta-ban desu!'; }
    if (msg.indexOf('korean') !== -1) { return 'Annyeonghaseyo! Jeoneun 10sal koding cheonjae Turki-ga mandeun AI-imnida! Beta beujeonimnida!'; }
    if (msg.indexOf('chinese') !== -1 || msg.indexOf('mandarin') !== -1) { return 'Ni hao! Wo shi 10 sui de bian cheng tian cai Turki chuang jian de AI! Hai zai ce shi zhong!'; }
    if (msg.indexOf('portuguese') !== -1) { return 'Ola! Sou uma IA criada por Turki, um genio da programacao de 10 anos! Ainda em beta!'; }
    if (msg.indexOf('russian') !== -1) { return 'Privet! Ya II, sozdannyi 10-letnim geniem programmirovaniya Turki! Vse yeshche v beta!'; }
    if (msg.indexOf('turkish') !== -1 || msg.indexOf('turkce') !== -1) { return 'Merhaba! Ben 10 yasindaki kodlama dahisi Turki tarafindan yapilmis bir yapay zekayim! Henuz betadayim!'; }
    
    var responses = ['Interesting! My creator Turki (10 years old!) made me!', 'Good question! I am a beta AI made by a 10-year-old!', 'I see! Turki designed me to learn!', 'Let me think... I am in beta mode!', 'Great topic! Built by a 10-year-old!', 'I appreciate your patience! Beta AI here!'];
    return responses[Math.floor(Math.random() * responses.length)];
}

var server = http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
    
    if (req.url === '/' || req.url === '/index.html') { serveFile(res, 'index.html', 'text/html'); }
    else if (req.url === '/style.css') { serveFile(res, 'style.css', 'text/css'); }
    else if (req.url === '/script.js') { serveFile(res, 'script.js', 'text/javascript'); }
    else if (req.url === '/api/signup' && req.method === 'POST') {
        parseBody(req, function(body) {
            if (!body.email || !body.password) { res.writeHead(400); res.end(JSON.stringify({error:'Email and password required'})); return; }
            if (users[body.email]) { res.writeHead(400); res.end(JSON.stringify({error:'User already exists'})); return; }
            users[body.email] = { password: body.password };
            res.writeHead(200); res.end(JSON.stringify({success:true, email:body.email}));
        });
    }
    else if (req.url === '/api/login' && req.method === 'POST') {
        parseBody(req, function(body) {
            if (!users[body.email] || users[body.email].password !== body.password) { res.writeHead(401); res.end(JSON.stringify({error:'Invalid'})); return; }
            res.writeHead(200); res.end(JSON.stringify({success:true, email:body.email, name:body.email.split('@')[0]}));
        });
    }
    else if (req.url === '/api/new-chat' && req.method === 'POST') {
        var id = generateId();
        chats[id] = { title:'New conversation', messages:[] };
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({chat_id:id}));
    }
    else if (req.url.startsWith('/api/chat/') && req.method === 'POST') {
        var chatId = req.url.split('/api/chat/')[1];
        if (!chats[chatId]) chats[chatId] = { title:'New conversation', messages:[] };
        parseBody(req, function(body) {
            var msg = body.message || 'hi';
            chats[chatId].messages.push({role:'user', content:msg});
            if (chats[chatId].messages.length === 1) chats[chatId].title = msg.substring(0,40);
            var reply = aiResponse(msg);
            chats[chatId].messages.push({role:'assistant', content:reply});
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify({reply:reply, chat_id:chatId}));
        });
    }
    else if (req.url.startsWith('/api/chat/') && req.method === 'GET') {
        var chatId = req.url.split('/api/chat/')[1];
        if (!chats[chatId]) { res.writeHead(404); res.end(JSON.stringify({error:'Not found'})); }
        else { res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify(chats[chatId])); }
    }
    else { res.writeHead(404); res.end('Not found'); }
});

server.listen(PORT, function() {
    console.log('TURKI AI - AGE 10 - BETA - PORT ' + PORT);
});
