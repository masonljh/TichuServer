var method = Round.prototype;

// 카드 일련번호 형식 : type_num_shape_score
/* BIRD(0),
	DOG(1),
	PHOENIX(2),
	DRAGON(3),
	NORMAL(4); */

function Round(users, turns) {
    this.paneCards = [];
    this.users = {};
    this.currentTurn;
    this.currentRank = 1;
    this.firstUserId;
    this.turns = turns;
    this.aScore = 0;
    this.bScore = 0;
    this.isFixedCards = false;
    this.skipTurn = [false, false, false, false];

    for (var id in users) {
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
        user.skipTurn = false;
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

    this.users[id].canCallLargeTichu = false;
    this.users[id].isLargeTichuCalled = true;
    this.users[id].canCallSmallTichu = false;
};

method.passLargeTichu = function(id) {
    // @TODO : (jonghyo) 테스트 코드 필요
    if (this.users[id] === undefined) {
        return;
    }

    if (!this.users[id].canCallLargeTichu) {
        return;
    }

    this.users[id].canCallLargeTichu = false;
};

method.checkAllLargeTichu = function() {
    // @TODO : (jonghyo) 테스트 코드 필요
    for (var id in this.users) {
        if (this.users[id].canCallLargeTichu) {
            return false;
        }
    }

    return true;
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
    if (this.users[data.from].isGivingCards) {
        return;
    }
    this.users[data.from].isGivingCards = true;

    for (var j = 0; j < data.infos.length; j++) {
        this.removeHandCard(this.users[data.from], data.infos[j].cardId);
    }

    for (var idx in data.infos) {
        this.users[data.infos[idx].to].receiveCards.push(data.infos[idx].cardId);
    }
};

method.checkAllGivingCards = function() {
    for (var userId in this.users) {
        var user = this.users[userId];
        if (!user.isGivingCards) {
            return false;
        }
    }

    return true;
};

method.fixCards = function() {
    this.isFixedCards = true;
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
};

method.getNextTurnUserId = function() {
    var nextTurnId;
    while (true) {
        for (var i in this.turns) {
            var userId = this.turns[i];
            if (userId === this.currentTurn) {
                var nextTurnIdx = Number.parseInt(i) === this.turns.length - 1 ? 0 : Number.parseInt(i) + 1;
                if (!this.skipTurn[nextTurnIdx]) {
                    nextTurnId = this.turns[nextTurnIdx];
                } else {
                    this.currentTurn = this.turns[nextTurnIdx];
                }
                break;
            }
        }

        if (nextTurnId) {
            break;
        }
    }

    return nextTurnId;
}

method.pass = function(id) {
    if (id !== this.currentTurn) {
        // 현재 차례가 아님(그리고 이 경우에는 꼭 확인해봐야 함)
        return;
    }

    this.currentTurn = this.getNextTurnUserId();
};

method.rewardPaneCards = function(id) {
    var user = this.users[id];
    for (var i in this.paneCards) {
        var cardCombination = this.paneCards[i];
        for (var j in cardCombination) {
            user.rewardCards.push(cardCombination[j]);
        }
    }

    this.paneCards = [];
}

method.raiseCards = function(id, cardIds) {
    if (id !== this.currentTurn) {
        // 현재 차례가 아님(그리고 이 경우에는 꼭 확인해봐야 함)
        return;
    }

    this.firstUserId = id;
    var user = this.users[id];
    user.canCallSmallTichu = false;
    
    for (var i in cardIds) {
        this.removeHandCard(user, cardIds[i]);
    }

    this.paneCards.push(cardIds);
    this.updateOtherSkipTurns(id);
    this.currentTurn = this.getNextTurnUserId();

    // console.log(this.users[id].handCards);
    // console.log(this.checkEmptyHand(id));
    if (!this.checkEmptyHand(id)) {
        return;
    }

    // console.log(id, this.currentRank);
    this.updateRank(id, this.currentRank);
    this.currentRank++;

    if (!this.isOver()) {
        return;
    }

    // console.log("라운드 종료");

    this.setLastRankAndMoveRewards();
    this.updateTotalScore();
};

method.removeHandCard = function(user, cardId) {
    const idx = user.handCards.indexOf(cardId);
    if (idx > -1) user.handCards.splice(idx, 1);
};

method.updateOtherSkipTurns = function(id) {
    for (var userId in this.users) {
        if (userId === id) {
            continue;
        }

        if (this.users[userId].handCards.length > 0) {
            continue;
        }

        for (var i in this.turns) {
            var turnId = this.turns[i];
            if (turnId === userId) {
                this.skipTurn[i] = true;
                this.users[userId].skipTurn = true;
                break;
            }
        }
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
    if (this.currentRank < 4) {
        return false;
    }

    return true;
};

method.setLastRankAndMoveRewards = function() {
    var firstUser;
    var lastUser;
    for (var userId in this.users) {
        var user = this.users[userId];
        if (user.rank === 1) {
            firstUser = user;
            continue;
        }

        if (user.rank > 0) {
            continue;
        }

        user.rank = 4;
        lastUser = user;
    }

    for (var idx in lastUser.rewardCards) {
        firstUser.rewardCards.push(lastUser.rewardCards[idx]);
    }
    lastUser.rewardCards = [];
};

method.getTichuScore = function(user) {
    var score = 0;
    if (user.isLargeTichuCalled) {
        score += user.isLargeTichuSuccess ? 200 : -200;
        return score;
    }

    if (user.isSmallTichuCalled) {
        score += user.isSmallTichuSuccess ? 100 : -100;
    }
    return score;
}

method.updateTotalScore = function() {
    var firstUser;
    var secondUser;
    var thirdUser;

    for (var userId in this.users) {
        var user = this.users[userId];

        // 티츄 성공 여부에 따른 점수 계산
        if (user.team === 'a') {
            this.aScore += this.getTichuScore(user);
        } else {
            this.bScore += this.getTichuScore(user);
        }

        switch(user.rank) {
            case 1:
                firstUser = user;
                break;
            case 2:
                secondUser = user;
                break;
            case 3:
                thirdUser = user;
                break;
        }
    }

    if (firstUser.team === secondUser.team) {
        // 1등, 2등이 같은 팀(원투)
        if (firstUser.team === 'a') {
            this.aScore += 200;
        } else {
            this.bScore += 200;
        }
        return;
    }

    if (firstUser.team === thirdUser.team) {
        // 1등, 3등이 같은 팀
        var score = getUserCardScore(secondUser);
        if (firstUser.team === 'a') {
            this.aScore += (100 - score);
            this.bScore += score;
        } else {
            this.aScore += score;
            this.bScore += (100 - score);
        }
        return;
    }

    // 1등, 4등이 같은 팀
    var score = getUserCardScore(firstUser);
    if (firstUser.team === 'a') {
        this.aScore += score;
        this.bScore += (100 - score);
    } else {
        this.aScore += (100 - score);
        this.bScore += score;
    }
};

method.getUserCardScore = function(user) {
    var rewardCards = user.rewardCards;
    var score = 0;
    for (var idx in rewardCards) {
        var cardId = rewardCards[idx];
        var cardInfo = cardId.split('_');
        score += Number.parseInt(cardInfo[3]);
    }

    return score;
};

method.getCurrentTurnUserId = function() {
    return this.currentTurn;
};

method.getOppositeUserId = function(id) {
    var team = this.users[id].team;
    var oppositeUserId;
    for (var userId in this.users) {
        if (userId === id) {
            continue;
        }

        if (team === this.users[userId].team) {
            continue;
        }

        if (oppositeUserId !== null && !this.users[oppositeUserId].skipTurn) {
            continue;
        }

        oppositeUserId = userId;
    }

    return oppositeUserId;
};

module.exports = Round;