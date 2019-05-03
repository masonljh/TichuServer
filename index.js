const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var Room = require('./room');

const PORT = process.env.PORT || 3000;

var users = {};
var rooms = {};
var games = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('setName', (name) => {
        users[socket.id] = name;
    });

    socket.on('getRoomList', () => {
        io.to(socket.id).emit('roomList', getRoomList());
    });

    socket.on('createRoom', (title, name) => {
        if (rooms[title] !== undefined) {
            io.to(socket.id).emit('room error', 1001);
            return;
        }

        rooms[title] = new Room(title, name);

        var room = rooms[title];
        socket.join(room.title, () => {
            console.log(name + ' join a ' + room.title);
            io.to(room.title).emit('join', room.title, name);
            io.emit('roomList', getRoomList());
        });
    });

    socket.on('joinRoom', (title, name) => {
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('room error', 1002);
            return;
        }

        room.joinUser(name, socket.id);

        socket.join(room.title, () => {
            console.log(name + ' join a ' + room.title);
            io.to(room.title).emit('join', room.title, name);
            io.emit('roomList', getRoomList());
        });
    });

    socket.on('leaveRoom', (title, name) => {
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('room error', 1002);
            return;
        }

        room.leaveUser(name);

        socket.leave(room.title, () => {
            console.log(name + ' leave a ' + room.title);
            io.to(room.title).emit('leave', room.title, name);

            if (room.isNotEmpty()) {
                return;
            }

            delete rooms[title];
            delete room;
            console.log('delete ' + title);

            io.emit('roomList', getRoomList());
        });
    });

    socket.on('chat message', (title, name, msg) => {
        var room = rooms[title];
        if (room === undefined) {
            return;
        }

        io.to(room.title).emit('chat message', name, msg);
    });

    socket.on('disconnect', () => {
        console.log(socket.id);
        console.log('user disconnected');
        var name = users[socket.id];
        console.log(name);
        var room = getRoom(name);
        console.log(room);

        if (room === undefined) {
            return;
        }

        room.leaveUser(name);
        io.to(room.title).emit('leave', room.title, name);
        console.log(name + ' leave a ' + room.title);
        if (room.isNotEmpty()) {
            return;
        }

        delete rooms[room.title];
        delete room;
        delete users[socket.id];

        io.emit('roomList', getRoomList());
    });
});

function getRoomInfo(room) {
    var roomInfo = {};
    roomInfo.title = room.title;
    roomInfo.personCnt = room.getUserCnt();
    roomInfo.maxPersonCnt = 4;
    return roomInfo;
}

function getRoom(id) {
    var room;
    for (var title in rooms) {
        if (!rooms[title].checkUser(id)) {
            continue;    
        }

        room = rooms[title];
        break;
    }

    return room;
}

function getRoomList() {
    var roomInfoList = [];
    console.log(rooms);
    for (var title in rooms) {
        roomInfoList.push(getRoomInfo(rooms[title]));
    }
    return roomInfoList;
}

http.listen(PORT, () => {
    console.log('Run Server!');
});