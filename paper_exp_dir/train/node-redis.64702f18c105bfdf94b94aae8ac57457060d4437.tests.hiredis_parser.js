var Parser = require('../lib/parser/hiredis').Parser;
var assert = require('assert');


(function testExecuteDoesNotCatchReplyCallbackExceptions() {
var parser = new Parser();
var replies = [{}];

parser.reader = {
feed: function() {},
get: function() {
return replies.shift();
}
};

var emittedError = false;
var caughtException = false;

parser
.on('error', function() {
emittedError = true;
})
.on('reply', function() {
throw new Error('bad');
});

try {
parser.execute();
} catch (err) {
caughtException = true;
}

assert.equal(caughtException, true);
assert.equal(emittedError, false);
})();
