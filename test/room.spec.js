const should = require('chai').should();
const expect = require('chai').expect();
const assert = require('assert');
const Room = require('../room');

describe('# Room Test', () => {
    describe('# getUserCnt', () => {
        it('should return 1 when aCnt is 1 And bCnt is 0', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            var userCnt = room.getUserCnt();
            
            // then
            assert.equal(1, userCnt);
        });

        it('should return 2 when aCnt is 2 And bCnt is 0', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');

            // when
            var userCnt = room.getUserCnt();
            
            // then
            assert.equal(2, userCnt);
        });

        it('should return 3 when aCnt is 2 And bCnt is 1', () => {
            // given
            var room = new Room('a', 'abc');
            room.joinUser('def');
            room.joinUser('ghi');

            // when
            var userCnt = room.getUserCnt();
            
            // then
            assert.equal(3, userCnt);
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
            assert.equal(4, userCnt);
        });
    });

    describe('# checkUser', () => {
        it('should return false when user is not member', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            var result = room.checkUser('abcd');

            // then
            assert.equal(false, result)
        });

        it('should return true when user is member', () => {
            // given
            var room = new Room('a', 'abc');

            // when
            var result = room.checkUser('abc');

            // then
            assert.equal(true, result)
        });
    });
});