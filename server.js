var http = require('http');
var fs = require('fs');
var path = require('path');

var PORT = process.env.PORT || 10000;
var chats = {};

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
        if (err) { res.writeHead(404); res.end('Not found'); return; }
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

function aiResponse(msg) {
    msg = msg.toLowerCase();
    if (msg.indexOf('hi') !== -1||msg.indexOf('hello')!==-1||msg.indexOf('hey')!==-1) return 'Hey! I am TurkiAI! Made by Turki, a 10 year old coding genius!';
    if (msg.indexOf('who made you')!==-1||msg.indexOf('who created you')!==-1) return 'I was made by Turki! He is 10 years old and built me from scratch!';
    if (msg.indexOf('turki')!==-1) return 'Turki is my amazing creator! 10 years old, coding legend!';
    if (msg.indexOf('beta')!==-1) return 'Yes I am in beta! Turki is still improving me!';
    var res = ['Cool!','Tell me more!','Interesting!','I see!','Turki is teaching me!'];
    return res[Math.floor(Math.random()*res.length)];
}

var server = http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
    
    if (req.url === '/' || req.url === '/index.html') { serveFile(res, 'index.html', 'text/html'); }
    else if (req.url === '/style.css') { serveFile(res, 'style.css', 'text/css'); }
    else if (req.url === '/script.js') { serveFile(res, 'script.js', 'text/javascript'); }
    else if (req.url === '/api/new-chat' && req.method === 'POST') {
        var id = generateId();
        chats[id] = { messages: [] };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ chat_id: id }));
    }
    else if (req.url.startsWith('/api/chat/') && req.method === 'POST') {
        var chatId = req.url.split('/api/chat/')[1];
        if (!chats[chatId]) chats[chatId] = { messages: [] };
        parseBody(req, function(body) {
            var msg = body.message || 'hi';
            chats[chatId].messages.push({ role: 'user', content: msg });
            var reply = aiResponse(msg);
            chats[chatId].messages.push({ role: 'assistant', content: reply });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ reply: reply, chat_id: chatId }));
        });
    }
    else if (req.url.startsWith('/api/chat/') && req.method === 'GET') {
        var chatId = req.url.split('/api/chat/')[1];
        if (!chats[chatId]) { res.writeHead(404); res.end('{}'); }
        else { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(chats[chatId])); }
    }
    else { res.writeHead(404); res.end('Not found'); }
});

server.listen(PORT, function() { console.log('TurkiAI on ' + PORT); });
