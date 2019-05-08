const Game = require('./game');

var method = Room.prototype;

function Room(title, id) {
    this.title = title;
    this.host = id;
    this.users = {};
    this.users[id] = { 
        'team' : 'a',
        'isConnecting' : true
    };
    this.aCnt = 1;
    this.bCnt = 0;
    this.state = 0;     // 0이면 대기, 1이면 게임 중, 2이면 게임 끝난 후
    // console.log("Room constructor called by " + id);
}

method.getUserCnt = function() {
    return this.aCnt + this.bCnt;
};

method.checkUser = function(id) {
    return this.users[id] !== undefined;
};

method.isWaiting = function() {
    return this.state === 0;
}

method.isFull = function(id) {
    return this.aCnt + this.bCnt === 4;
};

method.isStarted = function(id) {
    return this.game !== undefined;
};

method.isNotEmpty = function() {
    return this.aCnt + this.bCnt > 0;
};

method.joinUser = function(id) {
    if (this.checkUser(id)) {
        this.updateUserState(id, true);
        return;
    }

    if (this.isFull()) {
        return;
    }

    if (this.aCnt <= this.bCnt) {
        this.aCnt++;
        this.users[id] = { 
            'team' : 'a',
            'isConnecting' : true
        };
        return;
    }

    this.bCnt++;
    this.users[id] = { 
        'team' : 'b',
        'isConnecting' : true
    };
};

method.updateUserState = function(id, isConnecting) {
    if (!this.checkUser(id)) {
        return;
    }

    this.users[id].isConnecting = isConnecting;
};

method.leaveUser = function(id) {
    if (!this.checkUser(id)) {
        return;
    }

    if (this.users[id].team === 'a') {
        this.aCnt--;
    } else {
        this.bCnt--;
    }

    // console.log(this.users[id]);
    delete this.users[id];
    this.host = this.getNextHost();
};

method.getNextHost = function() {
    var hostId;
    for (var id in this.users) {
        if (!this.users[id].isConnecting) {
            hostId = id;
            continue;
        }

        hostId = id;
        return hostId;
    }

    return hostId;
};

method.startGame = function() {
    if (!this.isFull()) {
        return;
    }

    this.game = new Game(this.users);
    this.state = 1;
};

module.exports = Room;