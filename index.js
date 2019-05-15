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
    console.log('a user connected');
    socket.on('setName', (name) => {
        for (var socketId in users) {
            if (name === users[socketId]) {
                io.to(socket.id).emit('nameError', 1007);
                return;
            }
        }

        users[socket.id] = name;
        console.log(name + ' welcome');
        io.to(socket.id).emit('welcome', name);
    });

    socket.on('getRoomList', (name) => {
        io.to(socket.id).emit('roomList', getRoomList());
    });

    socket.on('getRoom', (title) => {
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        io.to(socket.id).emit('roomInfo', getRoomInfo(room));
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
            io.to(room.title).emit('leave', room.title, name, room.host);

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
        io.to(room.title).emit('startGame', { 'turns': room.game.turns });

        // 라운드 시작
        room.game.startRound();
        io.to(room.title).emit('startRound', { 'num' : room.game.rounds.length });

        // 첫 카드 분배
        console.log(title + ' : card first distribution');
        var round = room.game.getCurrentRound();
        round.distributeCardsFirst();

        for (var userId in round.users) {
            var user = round.users[userId];
            var data = { 'canCallLargeTichu' : true, 'canCallSmallTichu' : false, 'cardList': user.handCards };
            io.to(getSocketId(userId)).emit('distribute', data);
        }
    });

    socket.on('largeTichu', (title, name, isLargeTichuCalled) => {
        console.log('on LargeTichu ' + title + ' / ' + name + ' / ' + isLargeTichuCalled);
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        var round = room.game.getCurrentRound();
        if (isLargeTichuCalled) {
            round.callLargeTichu(name);
        } else {
            round.passLargeTichu(name);
        }
        io.to(room.title).emit('updateTichuInfo', { name: name, isLargeTichuCalled: isLargeTichuCalled });

        if (!round.checkAllLargeTichu()) {
            // 아직 모두가 라지티츄에 대한 선택을 하지 않음
            console.log('아직 다 라지티츄에 대해 결정하지 않음');
            return;
        }

        // 모두가 라지 티츄에 대한 선택을 했다면 두번째 카드 배분
        console.log(title + ' : card second distribution');
        round.distributeCardsSecond();

        for (var userId in round.users) {
            var user = round.users[userId];
            var data = { 'canCallLargeTichu' : user.canCallLargeTichu, 'canCallSmallTichu' : false, 'cardList': user.handCards };
            io.to(getSocketId(userId)).emit('distribute', data);
        }
    });

    socket.on('smallTichu', (title, name) => {
        console.log('on SmallTichu ' + title + ' / ' + name);
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        room.game.callSmallTichu(name);
        io.to(room.title).emit('updateTichuInfo', { name: name, isSmallTichuCalled: true });
    });

    socket.on('giveCards', (title, name, data) => {
        // { from : '', infos : [ { to : '', cardId : '' }, ....]}
        console.log('on GiveCards ' + title + ' / ' + name);
        console.log(data);
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        var info = {};
        info.from = name;
        info.infos = data;

        room.game.giveCards(info);

        var round = room.game.getCurrentRound();
        if (round.isFixedCards) {
            console.log("이미 카드 전달 완료!!");
            return;
        }

        if (!round.checkAllGivingCards()) {
            console.log("아직 카드 전달이 완료가 안 됨");
            return;
        }

        console.log("모든 유저의 카드 전달 완료!!");
        round.fixCards();
        for (var userId in round.users) {
            var user = round.users[userId];
            io.to(getSocketId(userId)).emit('fixCards', { 'name' : userId, 'canCallLargeTichu': user.canCallLargeTichu, 'canCallSmallTichu': user.canCallSmallTichu, 'cardList': user.handCards });
        }

        io.to(room.title).emit('turn', room.game.getCurrentRound().getCurrentTurnUserId());
    });

    socket.on('raiseCards', (title, name, cardList, isCallNum, num) => {
        console.log('on RaiseCards ' + title + ' / ' + name);
        console.log(cardList);
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        var round = room.game.getCurrentRound();
        if (isContainsNum(cardList, round.restrictNum)) {
            round.restrictNum = undefined;
            io.to(room.title).emit('releaseLimit');
        }

        room.game.raiseCards(name, cardList);
        if (isCallNum) {
            round.restrictNum = num;
        } 

        for (var userId in round.users) {
            var user = round.users[userId];

            var data = {
                name: name,
                paneCardList : round.paneCards,
                cardCnt : user.handCards.length
            };

            if (userId === name) {
                data.cardList = user.handCards;
            }

            io.to(room.title).emit('callNum', num);
            io.to(getSocketId(userId)).emit('raiseCards', data);
        }

        if (room.game.isEnd()) {
            // 게임이 끝났다고 알려줘야됨
            console.log('게임 끝');
            io.to(room.title).emit('endGame', room.game.winnerTeam);
            delete room.game;
            return;
        }

        if (room.game.isRoundOver()) {
            // 라운드만 끝이 났다면
            console.log('라운드 끝');
            room.game.startRound();

            io.to(room.title).emit('startRound', { 'num' : room.game.rounds.length });

            // 첫 카드 분배
            console.log(title + ' : card first distribution');
            var round = room.game.getCurrentRound();
            round.distributeCardsFirst();

            for (var userId in round.users) {
                var user = round.users[userId];
                var data = { 'canCallLargeTichu' : true, 'canCallSmallTichu' : false, 'cardList': user.handCards };
                io.to(getSocketId(userId)).emit('distribute', data);
            }
            return;
        }

        // 라운드도 끝이 안 났다면
        console.log('턴 넘어감');
        io.to(room.title).emit('turn', room.game.getCurrentRound().getCurrentTurnUserId());
    });

    socket.on('pass', (title, name) => {
        console.log('on Pass ' + title + ' / ' + name);
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        var round = room.game.getCurrentRound();
        round.pass(name);
        console.log(round.getCurrentTurnUserId());
        console.log(round.firstUserId);

        if (round.getCurrentTurnUserId() === round.firstUserId) {
            // 보상
            console.log(round.getCurrentTurnUserId());
            if (round.paneCards[round.paneCards.length - 1][0] === '3_98_0_25') {
                io.to(getSocketId(round.getCurrentTurnUserId())).emit('toWhom');
                return;
            } else {
                round.rewardPaneCards(round.firstUserId);
            }
            io.to(room.title).emit('clearPane');
            console.log(round.users[round.getCurrentTurnUserId()].handCards);
            if (round.users[round.getCurrentTurnUserId()].handCards.length === 0) {
                // 비어있다면 
                console.log("비어있음");
                for (var i in round.turns) {
                    var userId = round.turns[i];
                    if (userId === round.getCurrentTurnUserId()) {
                        round.skipTurn[i] = true;
                        round.pass(userId);
                        console.log(round.getCurrentTurnUserId());
                        break;
                    }
                }
            }
        }

        io.to(room.title).emit('turn', room.game.getCurrentRound().getCurrentTurnUserId());
    });

    socket.on('giveRewards', (title, name, who) => {
        console.log('on GiveRewards ' + title + ' / ' + name + ' / ' + who);
        var room = rooms[title];
        if (room === undefined) {
            io.to(socket.id).emit('roomError', 1002);
            return;
        }

        var round = room.game.getCurrentRound();
        round.rewardPaneCards(who);
        
        io.to(room.title).emit('clearPane');
        console.log(round.users[round.getCurrentTurnUserId()].handCards);
        if (round.users[round.getCurrentTurnUserId()].handCards.length === 0) {
            // 비어있다면 
            console.log("비어있음");
            for (var i in round.turns) {
                var userId = round.turns[i];
                if (userId === round.getCurrentTurnUserId()) {
                    round.skipTurn[i] = true;
                    round.pass(userId);
                    console.log(round.getCurrentTurnUserId());
                    break;
                }
            }
        }
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
        delete users[socket.id];

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

function isContainsNum(cardList, num) {
    if (!num) {
        return false;
    }

    for (var i in cardList) {
        var cardStrs = cardList[i].split('_');
        if (cardStrs[1] === num) {
            return true;
        }
    }

    return false;
}

http.listen(PORT, () => {
    console.log('Run Server!');
});