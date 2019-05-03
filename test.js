var Room = require('./game');

var testRoom = new Room('test01', 'a');
testRoom.joinUser('a');
testRoom.joinUser('b');
console.log(testRoom);
testRoom.leaveUser('a');
console.log(testRoom);