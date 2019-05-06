var method = Room.prototype;

function Room(title, id) {
    this.title = title;
    this.users = {};
    this.users[id] = { 
        'team' : 'a',
        'isConnecting' : true,
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
    return this.users.length === 4;
};

method.isStarted = function(id) {
    return this.game !== undefined;
};

method.isNotEmpty = function() {
    return this.aCnt + this.bCnt > 0;
}

method.joinUser = function(id) {
    if (this.checkUser(id)) {
        this.users[id].isConnecting = true;
        return;
    }

    if (this.isFull()) {
        return;
    }

    if (this.aCnt <= 1) {
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

    console.log(this.users[id]);
    delete this.users[id];
};

module.exports = Room;