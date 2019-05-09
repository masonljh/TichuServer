const Round = require('./round');

var method = Game.prototype;

function Game(users) {
    this.winnerTeam;
    this.rounds = [];
    this.users = {};
    this.turns = [];

    var temp;
    for (var id in users) {
        this.users[id] = {};
        this.users[id].team = users[id].team;
        if (this.turns.length === 0) {
            this.turns.push(id);
            continue;
        }

        if (this.turns[this.turns.length - 1].team === users[id].team) {
            temp = id;   
        } else {
            this.turns.push(id);

            if (temp) {
                this.turns.push(temp);
                temp = undefined;
            }
        }
    }
}

method.startRound = function() {
    this.rounds.push(new Round(this.users, this.turns));
};

method.getCurrentTurn = function() {
    var round = this.getCurrentRound();
    if (round === undefined) {
        return round;
    }
    return round.getCurrentTurnUserId();
};

method.getCurrentRound = function() {
    var currentRound;
    if (this.rounds.length > 0) {
        var length = this.rounds.length - 1;
        currentRound = this.rounds[length];
    }
    return currentRound;
};

method.callLargeTichu = function(id) {
    var round = this.getCurrentRound();
    if (round === undefined) {
        return round;
    }

    round.callLargeTichu(id);
};

method.passLargeTichu = function(id) {
    var round = this.getCurrentRound();
    if (round === undefined) {
        return round;
    }

    round.passLargeTichu(id);
};

method.callSmallTichu = function(id) {
    var round = this.getCurrentRound();
    if (round === undefined) {
        return round;
    }

    round.callSmallTichu(id);
};

method.giveCards = function(data) {
    var round = this.getCurrentRound();
    if (round === undefined) {
        return round;
    }

    round.giveCards(data);
};

method.distributeCardsFirst = function() {
    var round = this.getCurrentRound();
    if (round === undefined) {
        return round;
    }

    round.distributeCardsFirst();
};

method.distributeCardsSecond = function() {
    var round = this.getCurrentRound();
    if (round === undefined) {
        return round;
    }

    round.distributeCardsSecond();
};

method.pass = function(id) {
    var round = this.getCurrentRound();
    if (round === undefined) {
        // 진행 중인 라운드가 없음
        return;
    }

    round.pass(id);

    if (!round.isOver()) {
        return;
    }

    if (!this.isEnd()) {
        return;
    }

    this.winnerTeam = this.aScore > this.bScore ? 'a' : 'b';
};

method.raiseCards = function(id, cards) {
    var round = this.getCurrentRound();
    if (round === undefined) {
        // 진행 중인 라운드가 없음
        return;
    }

    round.raiseCards(id, cards);

    if (!round.isOver()) {
        return;
    }

    if (!this.isEnd()) {
        return;
    }

    this.winnerTeam = this.aScore > this.bScore ? 'a' : 'b';
};

method.isEnd = function() {
    this.aScore = 0;
    this.bScore = 0;
    for (var i in this.rounds) {
        var round = this.rounds[i];
        this.aScore += round.aScore;
        this.bScore += round.bScore;
    }

    if (this.aScore === this.bScore) {
        return false;
    }

    if (this.aScore >= 1000 || this.bScore >= 1000) {
        return true;
    }

    return false;
};

module.exports = Game;