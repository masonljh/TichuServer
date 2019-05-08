const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var Room = require('./room');

const PORT = process.env.PORT || 3000;

var users = {};
var rooms = {};
// 방 관련 에러 코드
// 1001 : createRoom할 때 타이틀 중복 시
// 1002 : 해당 타이틀을 가진 방이 없을 때
// 1003 : 해당 방에서 방장 권한이 없을 때(게임 시작시 발생)
// 1004 : 해당 방이 풀방이 아닐 때 게임 시작 시
// 1005 : 이미 게임 시작
// 1006 : 방이 꽉 참
// 1007 : 닉네임 중복
//

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // console.log('a user connected');
    socket.on('setName', (name) => {
        for (var socketId in users) {
            if (name === users[socketId]) {
                io.to(socket.id).emit('nameError', 1007);
                return;
            }
        }

        users[socket.id] = name;
        io.to(socket.id).emit('roomList', getRoomList());
    });

    socket.on('getRoomList', (name) => {
        io.to(socket.id).emit('roomList', getRoomList());
    });

    socket.on('createRoom', (title, name) => {
        if (rooms[title] !== undefined) {
            io.to(socket.id).emit('roomError', 1001);
            return;
        }

        rooms[title] = new Room(title, name);

        var room = rooms[title];
        socket.join(room.title, () => {
            console.log(name + ' join a ' + room.title);
            io.to(room.title).emit('join', room.title, name, 'a');
            io.emit('roomList', getRoomList());
        });
    });

    socket.on('joinRoom', (title, name) => {
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        if (room.isFull()) {
            console.log(title + ' is full');
            io.to(socket.id).emit('roomError', 1006);
            return;
        }

        room.joinUser(name, socket.id);

        socket.join(room.title, () => {
            console.log(name + ' join a ' + room.title);
            io.to(room.title).emit('join', room.title, name, room.users[name].team);
            io.emit('roomList', getRoomList());
        });
    });

    socket.on('leaveRoom', (title, name) => {
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
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

    socket.on('startGame', (title, name) => {
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        if (room.host !== name) {
            io.to(socket.id).emit('roomError', 1003);
            return;
        }

        if (!room.isFull()) {
            io.to(socket.id).emit('roomError', 1004);
            return;
        }

        if (room.isStarted()) {
            io.to(socket.id).emit('roomError', 1005);
            return;
        }

        // 게임 시작
        console.log(title + ' : game start!');
        room.startGame();
        io.to(room.title).emit('startGame', { 'users' : room.users });

        // 라운드 시작
        room.game.startRound();
        io.to(room.title).emit('startRound', { 'num' : room.game.rounds.length });

        // 첫 카드 분배
        var round = room.game.getCurrentRound();
        round.distributeCardsFirst();

        for (var userId in round.users) {
            var user = round.users[userId];
            var socketId = getSocketId(userId);
            var data = { 'canCallLargeTichu' : true, 'canCallSmallTichu' : false, 'cardList': user.handCards };
            io.to(socketId).emit('distribute', data);
        }
    });

    socket.on('largeTichu', (title, name) => {
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        room.game.callLargeTichu(name);
        io.to(room.title).emit('updateTichuInfo', { name: name, isLargeTichuCalled: true, isSmallTichuCalled: false });
    });

    socket.on('smallTichu', (title, name) => {
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        room.game.callSmallTichu(name);
        io.to(room.title).emit('updateTichuInfo', { name: name, isLargeTichuCalled: false, isSmallTichuCalled: true });
    });

    socket.on('chat message', (title, name, msg) => {
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        io.to(room.title).emit('chat message', name, msg);
    });

    socket.on('disconnect', () => {
        console.log(socket.id);
        console.log('user disconnected');
        var name = users[socket.id];
        var room = getRoom(name);

        if (room === undefined) {
            return;
        }

        room.leaveUser(name);
        io.to(room.title).emit('leave', room.title, name, room.host);
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
    roomInfo.host = room.host;
    roomInfo.users = room.users;
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

function getSocketId(name) {
    for (var socketId in users) {
        if (name !== users[socketId]) {
            continue;
        }

        return socketId;
    }    
}

function getRoomList() {
    var roomInfoList = [];
    for (var title in rooms) {
        roomInfoList.push(getRoomInfo(rooms[title]));
    }
    return roomInfoList;
}

http.listen(PORT, () => {
    console.log('Run Server!');
});