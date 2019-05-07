const should = require('chai').should();
const expect = require('chai').expect();
const assert = require('assert');
const Game = require('../game');
const Round = require('../round');

describe('# Game Test', () => {
    describe('# constructor', () => {
        it('constructor test', () => {
            // given
            var users = getDummyUsers();

            // when
            var game = new Game(users);

            // then
            assert.equal(game.users.abc !== undefined, true);
            assert.equal(game.rounds.length, 0);
        });
    });

    describe('# startRound', () => {
        it('should have a round', () => {
            // given
            var users = getDummyUsers();
            var game = new Game(users);

            // when
            game.startRound();

            // then
            assert.equal(game.rounds.length, 1);
        });
    });

    describe('# getCurrentTurn', () => {
        it('should return undefined', () => {
            // given
            var users = getDummyUsers();
            var game = new Game(users);

            // when
            var result = game.getCurrentTurn();

            // then
            assert.equal(result, undefined);
        });

        it('should return abc when abc is turn', () => {
            // given
            var users = getDummyUsers();
            var game = new Game(users);
            game.startRound();
            game.rounds[0].currentTurn = 'abc';


            // when
            var result = game.getCurrentTurn();

            // then
            assert.equal(result, 'abc');
        });
    });

    describe('# getCurrentRound', () => {
        it('should return undefined', () => {
            // given
            var users = getDummyUsers();
            var game = new Game(users);

            // when
            var result = game.getCurrentRound();

            // then
            assert.equal(result, undefined);
        });

        it('should return round when game has current round', () => {
            // given
            var users = getDummyUsers();
            var game = new Game(users);
            game.startRound();

            // when
            var result = game.getCurrentRound();

            // then
            assert.equal(result !== undefined, true);
        });
    });

    describe('# callLargeTichu', () => {});

    describe('# callSmallTichu', () => {});

    describe('# giveCards', () => {});

    describe('# distributeCardsFirst', () => {});

    describe('# distributeCardsSecond', () => {});

    describe('# pass', () => {});

    describe('# raiseCards', () => {});

    describe('# isEnd', () => {
        it('should return true when game is end', () => {
            // given
            var users = getDummyUsers();
            var game = new Game(users);
            game.startRound();
            game.rounds[0].aScore = 1000;
            game.rounds[0].bScore = 500;

            // when
            var result = game.isEnd();

            // then
            assert.equal(result, true);
        });

        it('should return false when game score is same', () => {
            // given
            var users = getDummyUsers();
            var game = new Game(users);
            game.startRound();
            game.rounds[0].aScore = 1050;
            game.rounds[0].bScore = 1050;

            // when
            var result = game.isEnd();

            // then
            assert.equal(result, false);
        });

        it('should return false when game is not end', () => {
            // given
            var users = getDummyUsers();
            var game = new Game(users);
            game.startRound();
            game.rounds[0].aScore = 700;
            game.rounds[0].bScore = 500;

            // when
            var result = game.isEnd();

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

function getDummyRound(users, aScore, bScore) {
    var round = new Round(users);
}