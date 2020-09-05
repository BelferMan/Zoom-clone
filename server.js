const express = require('express');
const uuid = require('uuid');
const app = express();
const server = require('http').createServer(app);
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const io = require('socket.io')(server);
const PORT = process.env.PORT || 5555;

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use('/modules', express.static(__dirname + '/node_modules'));
app.use('/peerJs', peerServer);

app.get('/', (req, res) => {
    res.redirect(`/${uuid.v4()}`)
});

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, peerId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connect', peerId);

        socket.on('message', (message) => {
            socket.to(roomId).emit('createMessage', message);
        });
    });
});

server.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`)
});
