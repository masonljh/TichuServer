var method = Round.prototype;

// 카드 일련번호 형식 : type_num_shape_score
/* BIRD(0),
	DOG(1),
	PHOENIX(2),
	DRAGON(3),
	NORMAL(4); */

function Round(users) {
    this.paneCards = [];
    for (var id in users) {
        this.users[id] = {};
        this.users[id].rewardCards = [];
        this.users[id].handCards = [];
    }
    this.cardContainer = [];
    this.cardContainer.push('0_1_0_0');
    this.cardContainer.push('1_99_0_0');
    this.cardContainer.push('2_-1_0_-25');
    this.cardContainer.push('3_98_0_25');
    for (var num = 2; num <= 14; i++) {
        for (var shape = 1; shape <= 4; shape++) {
            var score = num === 10 || num === 13 ? 10 : num === 5 ? 5 : 0;
            this.cardContainer.push('4_' + num + '_' + shape + '_' + score);
        }
    }
}

method.distributeCardsFirst = function() {
    // 8장씩 나눠줌
    for (var id in users) {
        for (var i = 0; i < 8; i++) {
            var ran = Math.floor(Math.random() * this.cardContainer.length);
            this.users[id].handCards.push(this.cardContainer[ran]);
            this.cardContainer.splice(ran, 1);
        }
    }
}

method.distributeCardsSecond = function() {
    // 6장씩 나눠줌
    for (var id in users) {
        for (var i = 0; i < 6; i++) {
            var ran = Math.floor(Math.random() * this.cardContainer.length);
            this.users[id].handCards.push(this.cardContainer[ran]);
            this.cardContainer.splice(ran, 1);
        }
    }
}

method.raiseCards = function(id, cardIds) {
    cardIds;
    this.paneCards.push()
};

module.exports = Round;