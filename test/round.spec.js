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
            var round = new Round(users, getDummyTurns());

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
            var round = new Round(users, getDummyTurns());

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
            var round = new Round(users, getDummyTurns());
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
            var round = new Round(users, getDummyTurns());
            round.users.abc.canCallLargeTichu = true;

            // when
            round.callLargeTichu('abc');

            // then
            assert.equal(round.users.abc.isLargeTichuCalled, true);
        });

        it('isLargeTichuCalled should not update', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
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
            var round = new Round(users, getDummyTurns());
            round.users.abc.canCallSmallTichu = true;

            // when
            round.callSmallTichu('abc');

            // then
            assert.equal(round.users.abc.isSmallTichuCalled, true);
        });

        it('isSmallTichuCalled should not update', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
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
            var round = new Round(users, getDummyTurns());
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

    describe('# checkAllGivingCard', () => {
        it('should return false', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.distributeCardsFirst();
            round.distributeCardsSecond();
            round.giveCards(getDummyGiveData(round, 'abc', ['def', 'ghi', 'jkl']));

            // when
            var result = round.checkAllGivingCards();

            // then
            assert.equal(result, false);
        });

        it('should return true', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.distributeCardsFirst();
            round.distributeCardsSecond();
            round.giveCards(getDummyGiveData(round, 'abc', ['def', 'ghi', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'def', ['abc', 'ghi', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'ghi', ['abc', 'def', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'jkl', ['abc', 'def', 'ghi']));

            // when
            var result = round.checkAllGivingCards();

            // then
            assert.equal(result, true);
        });
    });

    describe('# fixCards', () => {
        it('all cards should be in handCardsArray', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
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

    describe('# getNextTurnUserId', () => {
        it('should return ghi when abc turn', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.firstUserId = 'abc';
            round.currentTurn = 'abc';

            // when
            var result = round.getNextTurnUserId();

            // then
            assert.equal(result, 'ghi');
        });

        it('should return jkl when def turn', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.firstUserId = 'def';
            round.currentTurn = 'def';

            // when
            var result = round.getNextTurnUserId();

            // then
            assert.equal(result, 'jkl');
        });

        it('should return def when ghi turn', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.firstUserId = 'ghi';
            round.currentTurn = 'ghi';

            // when
            var result = round.getNextTurnUserId();

            // then
            assert.equal(result, 'def');
        });

        it('should return abc when jkl turn', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.firstUserId = 'jkl';
            round.currentTurn = 'jkl';

            // when
            var result = round.getNextTurnUserId();

            // then
            assert.equal(result, 'abc');
        });
    });

    describe('# pass', () => {
        it('should reward first user', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.users.abc.handCards.push('3_98_0_25');
            round.firstUserId = 'abc';
            round.currentTurn = 'jkl';
            round.paneCards = [['4_10_1_10', '4_10_1_10'], ['4_13_1_10', '4_13_1_10']];

            // when
            round.pass('jkl');

            // then
            // @TODO : (jonghyo) 나중에 테스트 코드 변경해야됨
            assert.equal(round.getCurrentTurnUserId(), 'abc');
            // assert.equal(round.users.abc.rewardCards.length, 4);
            // assert.equal(round.paneCards.length, 0);
        });

        it('should not reward', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.firstUserId = 'jkl';
            round.currentTurn = 'abc';
            round.paneCards = [['4_10_1_10', '4_10_1_10'], ['4_13_1_10', '4_13_1_10']];

            // when
            round.pass('abc');

            // then
            // @TODO : (jonghyo) 나중에 테스트 코드 변경해야됨
            assert.equal(round.getCurrentTurnUserId(), 'ghi');
            // assert.equal(round.users.abc.rewardCards.length, 0);
            // assert.equal(round.paneCards.length, 2);
        });
    });

    describe('# rewardPaneCards', () => {
        it('should be empty', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.paneCards = [['4_10_1_10', '4_10_1_10'], ['4_13_1_10', '4_13_1_10']];

            // when
            round.rewardPaneCards('abc');

            // then
            assert.equal(round.users.abc.rewardCards.length, 4);
            assert.equal(round.paneCards.length, 0);
        });
    });

    describe('# raiseCards', () => {
        it('should raise cards', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.distributeCardsFirst();
            round.distributeCardsSecond();
            round.giveCards(getDummyGiveData(round, 'abc', ['def', 'ghi', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'def', ['abc', 'ghi', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'ghi', ['abc', 'def', 'jkl']));
            round.giveCards(getDummyGiveData(round, 'jkl', ['abc', 'def', 'ghi']));
            round.fixCards();
            var currentTurnId = round.getCurrentTurnUserId();
            var cardId = round.users[currentTurnId].handCards[0];

            // when
            round.raiseCards(currentTurnId, [ round.users[currentTurnId].handCards[0] ]);

            // @TODO : (jonghyo) 여러 장 낼 때도 체크 필요

            // then
            assert.equal(round.users[currentTurnId].handCards.length, 13);
            assert.equal(round.paneCards.length, 1);
            assert.equal(round.paneCards[0].length, 1);
            assert.equal(round.paneCards[0][0], cardId);
        });
    });

    describe('# checkEmptyHand', () => {
        it('should return false when user has cards', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.distributeCardsFirst();
            
            // when
            var result = round.checkEmptyHand('abc');

            // then
            assert.equal(result, false);
        });

        it('should return true when user has no card', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            
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
            var round = new Round(users, getDummyTurns());
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
            var round = new Round(users, getDummyTurns());
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
            var round = new Round(users, getDummyTurns());
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
            var round = new Round(users, getDummyTurns());
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
            var round = new Round(users, getDummyTurns());
            round.currentRank = 4;
            
            // when
            var result = round.isOver();

            // then
            assert.equal(result, true);
        });

        it('should return false when round is not over', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            
            // when
            var result = round.isOver();

            // then
            assert.equal(result, false);
        });
    });

    describe('# setLastRankAndMoveRewards', () => {
        it('should set last rank(4) and remove rewards', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.users.abc.rank = 3;
            round.users.def.rank = 2;
            round.users.jkl.rank = 1;
            round.users.ghi.rewardCards.push('0_1_0_0');
            round.users.ghi.rewardCards.push('1_99_0_0');
            round.users.ghi.rewardCards.push('4_2_4_0');
            round.users.ghi.rewardCards.push('4_6_3_0');
            round.currentRank = 4;
            
            // when
            round.setLastRankAndMoveRewards();

            // then
            assert.equal(round.users.ghi.rank, 4);
            assert.equal(round.users.jkl.rewardCards.length, 4);
            assert.equal(round.users.ghi.rewardCards.length, 0);
        });
    });

    describe('# getTichuScore', () => {
        it('should return 200 when largeTichu is success', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.users.abc.isLargeTichuCalled = true;
            round.users.abc.isLargeTichuSuccess = true;

            // when
            var result = round.getTichuScore(round.users.abc);

            // then
            assert.equal(result, 200);
        });

        it('should return -200 when largeTichu is failure', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.users.abc.isLargeTichuCalled = true;
            round.users.abc.isLargeTichuSuccess = false;

            // when
            var result = round.getTichuScore(round.users.abc);

            // then
            assert.equal(result, -200);
        });

        it('should return 100 when smallTichu is success', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.users.abc.isSmallTichuCalled = true;
            round.users.abc.isSmallTichuSuccess = true;

            // when
            var result = round.getTichuScore(round.users.abc);

            // then
            assert.equal(result, 100);
        });

        it('should return -100 when smallTichu is failure', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.users.abc.isSmallTichuCalled = true;
            round.users.abc.isSmallTichuSuccess = false;

            // when
            var result = round.getTichuScore(round.users.abc);

            // then
            assert.equal(result, -100);
        });
    });

    describe('# updateTotalScore', () => {
        // @TODO : (jonghyo) 이건 나중에 좀 넣어보자
    });

    describe('# getUserCardScore', () => {
        it('should return 0 when user has cards without score', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.users.abc.rewardCards.push('0_1_0_0');
            round.users.abc.rewardCards.push('1_99_0_0');
            round.users.abc.rewardCards.push('4_2_4_0');
            round.users.abc.rewardCards.push('4_6_3_0');
            
            // when
            var result = round.getUserCardScore(round.users.abc);

            // then
            assert.equal(result, 0);
        });

        it('should return 10 when user has cards with score', () => {
            // given
            var users = getDummyUsers();
            var round = new Round(users, getDummyTurns());
            round.users.abc.rewardCards.push('2_-1_0_-25');
            round.users.abc.rewardCards.push('4_5_4_5');
            round.users.abc.rewardCards.push('4_10_2_10');
            
            // when
            var result = round.getUserCardScore(round.users.abc);

            // then
            assert.equal(result, -10);
        });
    });
});

function getDummyTurns() {
    var turns = ['abc', 'ghi', 'def', 'jkl'];
    return turns;
}

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