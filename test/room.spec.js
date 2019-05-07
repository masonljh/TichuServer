const should = require('chai').should();
const expect = require('chai').expect();
const assert = require('assert');
const Room = require('../room');

describe('# Room Test', () => {
    describe('# constructor', () => {
        it('constructor test', () => {
            // given

            // when
            var room = new Room('a', 'abc');

            // then
            assert.equal(room.title, 'a');
            assert.equal(room.getUserCnt(), 1);
            assert.equal(room.checkUser('abc'), true);
            assert.equal(room.isWaiting(), true);
        });
    });

    describe('# getUserCnt', () => {
        it('should return 1 when aCnt is 1 And bCnt is 0', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            var userCnt = room.getUserCnt();
            
            // then
            assert.equal(userCnt, 1);
        });

        it('should return 2 when aCnt is 2 And bCnt is 0', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');

            // when
            var userCnt = room.getUserCnt();
            
            // then
            assert.equal(userCnt, 2);
        });

        it('should return 3 when aCnt is 2 And bCnt is 1', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');
            room.joinUser('ghi');

            // when
            var userCnt = room.getUserCnt();
            
            // then
            assert.equal(userCnt, 3);
        });

        it('should return 4 when aCnt is 2 And bCnt is 2', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');
            room.joinUser('ghi');
            room.joinUser('jkl');

            // when
            var userCnt = room.getUserCnt();
            
            // then
            assert.equal(userCnt, 4);
        });
    });

    describe('# checkUser', () => {
        it('should return false when user is not member', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            var result = room.checkUser('abcd');

            // then
            assert.equal(result, false);
        });

        it('should return true when user is member', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            var result = room.checkUser('abc');

            // then
            assert.equal(result, true);
        });
    });

    describe('# isWaiting', () => {
        it('should return true when room is waiting', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            var result = room.isWaiting();

            // then
            assert.equal(result, true);
        });

        it('should return false when room is not waiting', () => {
            // given
            var room = new Room('a', 'abc');
            room.state = 1;

            // when
            var result = room.isWaiting();

            // then
            assert.equal(result, false);
        });
    });

    describe('# isFull', () => {
        it('should return true when room is full', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');
            room.joinUser('ghi');
            room.joinUser('jkl');

            // when
            var result = room.isFull();

            // then
            assert.equal(result, true);
        });

        it('should return false when room is not full', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            var result = room.isFull();

            // then
            assert.equal(result, false);
        });
    });

    describe('# isStarted', () => {
        it('should return true when room is started', () => {
            // given
            var room = new Room('a', 'abc');
            // @TODO : (jonghyo) 나중에는 게임 오브젝트를 만들어 넣도록 설정
            room.game = {};

            // when
            var result = room.isStarted();

            // then
            assert.equal(result, true);
        });

        it('should return false when room is waiting', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            var result = room.isStarted();

            // then
            assert.equal(result, false);
        });
    });

    describe('# isNotEmpty', () => {
        it('should return true when room is not empty', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            var result = room.isNotEmpty();

            // then
            assert.equal(result, true);
        });

        it('should return false when room is empty', () => {
            // given
            var room = new Room('a', 'abc');
            room.leaveUser('abc');

            // when
            var result = room.isNotEmpty();

            // then
            assert.equal(result, false);
        });
    });

    describe('# joinUser', () => {
        it('should be room which has 2 members', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            room.joinUser('def');
            
            // then
            assert.equal(room.getUserCnt(), 2);
        });

        it('should be room which has 3 members', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            room.joinUser('def');
            room.joinUser('ghi');
            
            // then
            assert.equal(room.getUserCnt(), 3);
        });

        it('should be room which has 4 members', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            room.joinUser('def');
            room.joinUser('ghi');
            room.joinUser('jkl');
            
            // then
            assert.equal(room.getUserCnt(), 4);
        });

        it('should ignore when room is full', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');
            room.joinUser('ghi');
            room.joinUser('jkl');

            // when
            room.joinUser('mno');
            
            // then
            assert.equal(room.getUserCnt(), 4);
        });

        it('should update userState when room has duplicated member', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');
            room.joinUser('ghi');
            room.joinUser('jkl');
            room.users['abc'].isConnecting = false;

            // when
            room.joinUser('abc');
            
            // then
            assert.equal(room.getUserCnt(), 4);
            assert.equal(room.users['abc'].isConnecting, true);
        });
    });

    describe('# updateUserState', () => {
        it('should update userState', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            room.updateUserState('abc', false);

            // then
            assert.equal(room.users['abc'].isConnecting, false);
        });
    });

    describe('# leaveUser', () => {
        it('should be room which has 3 members', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');
            room.joinUser('ghi');
            room.joinUser('jkl');

            // when
            room.leaveUser('jkl');
            
            // then
            assert.equal(room.getUserCnt(), 3);
        });

        it('should be room which has 2 members', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');
            room.joinUser('ghi');

            // when
            room.leaveUser('ghi');
            
            // then
            assert.equal(room.getUserCnt(), 2);
        });

        it('should be room which has 1 members', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');

            // when
            room.leaveUser('def');
            
            // then
            assert.equal(room.getUserCnt(), 1);
        });

        it('should be room which is empty', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            room.leaveUser('abc');
            
            // then
            assert.equal(room.getUserCnt(), 0);
        });

        it('should ignore when room is empty', () => {
            // given
            var room = new Room('a', 'abc');
            room.leaveUser('abc');

            // when
            room.leaveUser('abc');
            
            // then
            assert.equal(room.getUserCnt(), 0);
        });

        it('should ignore when room has not that member', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');
            room.joinUser('ghi');
            room.joinUser('jkl');

            // when
            room.leaveUser('mno');
            
            // then
            assert.equal(room.getUserCnt(), 4);
        });
    });
});