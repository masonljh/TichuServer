var method = Game.prototype;

function Game(users) {
    this.aScore = 0;
    this.bScore = 0;
    this.rounds = [];
    this.users = {};
    for (var id in users) {
        this.users[id] = {};
        this.users[id].team = users[id].team;
    }
}

method.getCurrentRound = function() {
    var currentRound;
    if (rounds.length > 0) {
        currentRound = rounds[rounds.length - 1];
    }
    return currentRound;
}

method.startRound = function() {

};

method.raiseCards = function(id, cards) {
    
};

module.exports = Game;