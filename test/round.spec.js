const should = require('chai').should();
const expect = require('chai').expect();
const assert = require('assert');
const Round = require('../round');

describe('# Round Test', () => {
    describe('# constructor', () => {
        it('constructor test', () => {
            // given
            var users = getDummyUsers();

            // when
            var round = new Round(users);

            // then
            assert.equal(round.users.abc != undefined, true);
            assert.equal(round.users.abc.team, 'a');
            assert.equal(round.users.abc.canCallLargeTichu, true);
            assert.equal(round.users.abc.canCallSmallTichu, false);
            assert.equal(round.users.abc.isLargeTichuCalled, false);
            assert.equal(round.users.abc.isSmallTichuCalled, false);
            assert.equal(round.users.abc.isLargeTichuSuccess, false);
            assert.equal(round.users.abc.isSmallTichuSuccess, false);
            assert.equal(round.users.def != undefined, true);
            assert.equal(round.users.def.team, 'a');
            assert.equal(round.users.def.canCallLargeTichu, true);
            assert.equal(round.users.def.canCallSmallTichu, false);
            assert.equal(round.users.def.isLargeTichuCalled, false);
            assert.equal(round.users.def.isSmallTichuCalled, false);
            assert.equal(round.users.def.isLargeTichuSuccess, false);
            assert.equal(round.users.def.isSmallTichuSuccess, false);
            assert.equal(round.users.ghi != undefined, true);
            assert.equal(round.users.ghi.team, 'b');
            assert.equal(round.users.ghi.canCallLargeTichu, true);
            assert.equal(round.users.ghi.canCallSmallTichu, false);
            assert.equal(round.users.ghi.isLargeTichuCalled, false);
            assert.equal(round.users.ghi.isSmallTichuCalled, false);
            assert.equal(round.users.ghi.isLargeTichuSuccess, false);
            assert.equal(round.users.ghi.isSmallTichuSuccess, false);
            assert.equal(round.users.jkl != undefined, true);
            assert.equal(round.users.jkl.team, 'b');
            assert.equal(round.users.jkl.canCallLargeTichu, true);
            assert.equal(round.users.jkl.canCallSmallTichu, false);
            assert.equal(round.users.jkl.isLargeTichuCalled, false);
            assert.equal(round.users.jkl.isSmallTichuCalled, false);
            assert.equal(round.users.jkl.isLargeTichuSuccess, false);
            assert.equal(round.users.jkl.isSmallTichuSuccess, false);
            assert.equal(round.cardContainer.length, 56);
            assert.equal(round.paneCards.length, 0);
        });
    });

    describe('# distributeCardsFirst', () => {
        it('all users should have 8 cards', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);

            // when
            round.distributeCardsFirst();

            // then
            assert.equal(round.users.abc.canCallLargeTichu, true);
            assert.equal(round.users.abc.canCallSmallTichu, false);
            assert.equal(round.users.def.canCallLargeTichu, true);
            assert.equal(round.users.def.canCallSmallTichu, false);
            assert.equal(round.users.ghi.canCallLargeTichu, true);
            assert.equal(round.users.ghi.canCallSmallTichu, false);
            assert.equal(round.users.jkl.canCallLargeTichu, true);
            assert.equal(round.users.jkl.canCallSmallTichu, false);
            assert.equal(round.users.abc.handCards.length, 8);
            assert.equal(round.users.def.handCards.length, 8);
            assert.equal(round.users.ghi.handCards.length, 8);
            assert.equal(round.users.jkl.handCards.length, 8);
            assert.equal(round.cardContainer.length, 24);
        });
    });

    describe('# distributeCardsSecond', () => {
        it('all users should have 14 cards', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.distributeCardsFirst();

            // when
            round.distributeCardsSecond();

            // then
            assert.equal(round.users.abc.canCallLargeTichu, false);
            assert.equal(round.users.abc.canCallSmallTichu, true);
            assert.equal(round.users.def.canCallLargeTichu, false);
            assert.equal(round.users.def.canCallSmallTichu, true);
            assert.equal(round.users.ghi.canCallLargeTichu, false);
            assert.equal(round.users.ghi.canCallSmallTichu, true);
            assert.equal(round.users.jkl.canCallLargeTichu, false);
            assert.equal(round.users.jkl.canCallSmallTichu, true);
            assert.equal(round.users.abc.handCards.length, 14);
            assert.equal(round.users.def.handCards.length, 14);
            assert.equal(round.users.ghi.handCards.length, 14);
            assert.equal(round.users.jkl.handCards.length, 14);
            assert.equal(round.cardContainer.length, 0);
        });
    });

    describe('# callLargeTichu', () => {
        it('isLargeTichuCalled should be true', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.users.abc.canCallLargeTichu = true;

            // when
            round.callLargeTichu('abc');

            // then
            assert.equal(round.users.abc.isLargeTichuCalled, true);
        });

        it('isLargeTichuCalled should not update', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.users.abc.canCallLargeTichu = false;

            // when
            round.callLargeTichu('abc');

            // then
            assert.equal(round.users.abc.isLargeTichuCalled, false);
        });
    });

    describe('# callSmallTichu', () => {
        it('isSmallTichuCalled should be true', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.users.abc.canCallSmallTichu = true;

            // when
            round.callSmallTichu('abc');

            // then
            assert.equal(round.users.abc.isSmallTichuCalled, true);
        });

        it('isSmallTichuCalled should not update', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.users.abc.canCallSmallTichu = false;

            // when
            round.callSmallTichu('abc');

            // then
            assert.equal(round.users.abc.isSmallTichuCalled, false);
        });
    });

    describe('# giveCards', () => {
        it('should remove cards from abc', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.distributeCardsFirst();
            round.distributeCardsSecond();
            var data = getDummyGiveData(round, 'abc', ['def', 'ghi', 'jkl']);

            // when
            round.giveCards(data);

            // then
            assert.equal(round.users.abc.handCards.length, 11);
            assert.equal(round.users.def.receiveCards.length, 1);
            assert.equal(round.users.ghi.receiveCards.length, 1);
            assert.equal(round.users.jkl.receiveCards.length, 1);
            assert.equal(round.users.abc.isGivingCards, true);
        });
    });

    describe('# fixCards', () => {
        it('all cards should be in handCardsArray', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.distributeCardsFirst();
            round.distributeCardsSecond();
            round.giveCards(getDummyGiveData(round, 'abc', ['def', 'ghi', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'def', ['abc', 'ghi', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'ghi', ['abc', 'def', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'jkl', ['abc', 'def', 'ghi']));

            // when
            round.fixCards();

            // then
            assert.equal(round.users.abc.handCards.length, 14);
            assert.equal(round.users.def.handCards.length, 14);
            assert.equal(round.users.ghi.handCards.length, 14);
            assert.equal(round.users.jkl.handCards.length, 14);
            assert.equal(round.getCurrentTurnUserId !== undefined, true);
        });
    });

    describe('# raiseCards', () => {
        it('should raise cards', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.distributeCardsFirst();
            round.distributeCardsSecond();
            round.giveCards(getDummyGiveData(round, 'abc', ['def', 'ghi', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'def', ['abc', 'ghi', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'ghi', ['abc', 'def', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'jkl', ['abc', 'def', 'ghi']));
            round.fixCards();
            var cardId = round.users.abc.handCards[0];

            // when
            round.raiseCards('abc', [ round.users.abc.handCards[0] ]);

            // then
            assert.equal(round.users.abc.handCards.length, 13);
            assert.equal(round.paneCards.length, 1);
            assert.equal(round.paneCards[0].length, 1);
            assert.equal(round.paneCards[0][0], cardId);
        });
    });

    describe('# checkEmptyHand', () => {
        it('should return false when user has cards', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.distributeCardsFirst();
            
            // when
            var result = round.checkEmptyHand('abc');

            // then
            assert.equal(result, false);
        });

        it('should return true when user has no card', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            
            // when
            var result = round.checkEmptyHand('abc');

            // then
            assert.equal(result, true);
        });
    });

    describe('# updateRank', () => {
        it('should has user which rank is 1 and largeTichu is success', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.users.abc.isLargeTichuCalled = true;
            
            // when
            round.updateRank('abc', 1);

            // then
            assert.equal(round.users.abc.isLargeTichuSuccess, true);
            assert.equal(round.users.abc.isSmallTichuSuccess, false);
            assert.equal(round.users.abc.rank, 1);
        });

        it('should has user which rank is 1 and smallTichu is success', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.users.abc.isSmallTichuCalled = true;
            
            // when
            round.updateRank('abc', 1);

            // then
            assert.equal(round.users.abc.isLargeTichuSuccess, false);
            assert.equal(round.users.abc.isSmallTichuSuccess, true);
            assert.equal(round.users.abc.rank, 1);
        });

        it('should has user which rank is 2 and largeTichu is failure', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.users.abc.isLargeTichuCalled = true;
            
            // when
            round.updateRank('abc', 2);

            // then
            assert.equal(round.users.abc.isLargeTichuSuccess, false);
            assert.equal(round.users.abc.isSmallTichuSuccess, false);
            assert.equal(round.users.abc.rank, 2);
        });

        it('should has user which rank is 2 and smallTichu is failure', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.users.abc.isSmallTichuCalled = true;
            
            // when
            round.updateRank('abc', 2);

            // then
            assert.equal(round.users.abc.isLargeTichuSuccess, false);
            assert.equal(round.users.abc.isSmallTichuSuccess, false);
            assert.equal(round.users.abc.rank, 2);
        });
    });

    describe('# isOver', () => {
        it('should return true when round is over', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            round.currentRank = 5;
            
            // when
            var result = round.isOver();

            // then
            assert.equal(result, true);
        });

        it('should return false when round is not over', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users);
            
            // when
            var result = round.isOver();

            // then
            assert.equal(result, false);
        });
    });
});

function getDummyUsers() {
    var users = {};
    users.abc = { 'team' : 'a', 'isConnecting' : true };
    users.def = { 'team' : 'a', 'isConnecting' : true };
    users.ghi = { 'team' : 'b', 'isConnecting' : true };
    users.jkl = { 'team' : 'b', 'isConnecting' : true };
    return users;
}

function getDummyGiveData(round, from, tos) {
    var data = { 'from': from, infos: [] };
    data.infos.push({ 'to': tos[0], 'cardId': round.users[from].handCards[0] });
    data.infos.push({ 'to': tos[1], 'cardId': round.users[from].handCards[1] });
    data.infos.push({ 'to': tos[2], 'cardId': round.users[from].handCards[2] });
    return data;
}