var method = Round.prototype;

// 카드 일련번호 형식 : type_num_shape_score
/* BIRD(0),
	DOG(1),
	PHOENIX(2),
	DRAGON(3),
	NORMAL(4); */

function Round(users) {
    this.paneCards = [];
    this.users = {};
    this.currentTurn;
    this.currentRank = 1;
    for (var id in users) {
        if (this.currentTurn === undefined) {
            this.currentTurn = id;
        }

        this.users[id] = {};
        var user = this.users[id];
        user.team = users[id].team;
        user.rewardCards = [];
        user.handCards = [];
        user.receiveCards = [];
        user.canCallLargeTichu = true;
        user.canCallSmallTichu = false;
        user.isLargeTichuCalled = false;
        user.isSmallTichuCalled = false;
        user.isLargeTichuSuccess = false;
        user.isSmallTichuSuccess = false;
        user.isGivingCards = false;
        user.rank = 0;
    }
    this.cardContainer = [];
    this.cardContainer.push('0_1_0_0');
    this.cardContainer.push('1_99_0_0');
    this.cardContainer.push('2_-1_0_-25');
    this.cardContainer.push('3_98_0_25');
    for (var num = 2; num <= 14; num++) {
        for (var shape = 1; shape <= 4; shape++) {
            var score = num === 10 || num === 13 ? 10 : num === 5 ? 5 : 0;
            this.cardContainer.push('4_' + num + '_' + shape + '_' + score);
        }
    }
}

method.callLargeTichu = function(id) {
    if (this.users[id] === undefined) {
        return;
    }

    if (!this.users[id].canCallLargeTichu) {
        return;
    }

    this.users[id].isLargeTichuCalled = true;
};

method.callSmallTichu = function(id) {
    if (this.users[id] === undefined) {
        return;
    }

    if (!this.users[id].canCallSmallTichu) {
        return;
    }

    this.users[id].isSmallTichuCalled = true;
};

method.distributeCardsFirst = function() {
    // 8장씩 나눠줌
    for (var id in this.users) {
        for (var i = 0; i < 8; i++) {
            var ran = Math.floor(Math.random() * this.cardContainer.length);
            this.users[id].handCards.push(this.cardContainer[ran]);
            this.cardContainer.splice(ran, 1);
        }
    }
};

method.distributeCardsSecond = function() {
    for (var id in this.users) {
        this.users[id].canCallLargeTichu = false;
        this.users[id].canCallSmallTichu = true;
    }

    // 6장씩 나눠줌
    for (var id in this.users) {
        for (var i = 0; i < 6; i++) {
            var ran = Math.floor(Math.random() * this.cardContainer.length);
            this.users[id].handCards.push(this.cardContainer[ran]);
            this.cardContainer.splice(ran, 1);
        }
    }
};

method.giveCards = function(data) {
    // { from : '', infos : [ { to : '', cardId : '' }, ....]}
    var removeIdxArray = [];
    for (var i = 0; i < this.users[data.from].handCards.length; i++) {
        for (var j = 0; j < data.infos.length; j++) {
            if (this.users[data.from].handCards[i] === data.infos[j].cardId) {
                removeIdxArray.push(i);
            }
        }
    }

    for (var idx in removeIdxArray) {
        this.users[data.from].handCards.splice(removeIdxArray[idx], 1);
    }

    for (var idx in data.infos) {
        this.users[data.infos[idx].to].receiveCards.push(data.infos[idx].cardId);
    }

    this.users[data.from].isGivingCards = true;
};

method.fixCards = function() {
    for (var userId in this.users) {
        var user = this.users[userId];
        for (var i in user.receiveCards) {
            user.handCards.push(user.receiveCards[i]);
        }

        for (var i in user.handCards) {
            if (user.handCards[i] !== '0_1_0_0') {
                continue;
            }

            // 새가 있을 경우 해당 사람 턴으로 라운드 시작
            this.currentTurn = userId;
        }
        user.receiveCards = [];
    }
}

method.raiseCards = function(id, cardIds) {
    if (id !== this.currentTurn) {
        // 현재 차례가 아님(그리고 이 경우에는 꼭 확인해봐야 함)
        return;
    }

    var user = this.users[id];
    var removeIdxArray = [];
    for (var i = 0; i < user.handCards.length; i++) {
        for (var j = 0; j < cardIds.length; j++) {
            if (user.handCards[i] === cardIds[j]) {
                removeIdxArray.push(i);
                break;
            }
        }
    }

    for (var idx in removeIdxArray) {
        user.handCards.splice(removeIdxArray[idx], 1);
    }

    this.paneCards.push(cardIds);

    if (!this.checkEmptyHand(id)) {
        return;
    }

    this.updateRank(id, this.currentRank);

    if (!this.isOver()) {
        return;
    }
};

method.checkEmptyHand = function(id) {
    return this.users[id].handCards.length === 0;
};

method.updateRank = function(id, rank) {
    var user = this.users[id];
    user.rank = rank;
    if (user.rank !== 1) {
        return;
    }

    if (user.isLargeTichuCalled) {
        user.isLargeTichuSuccess = true;
        return;
    }

    if (user.isSmallTichuCalled) {
        user.isSmallTichuSuccess = true;
    }
};

method.isOver = function() {
    return this.currentRank >= 5;
};

method.getCurrentTurnUserId = function() {
    return this.currentTurn;
}

module.exports = Round;