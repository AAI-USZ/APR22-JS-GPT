var formatError = function(error) {
var stack = error.stack;
var message = error.message;

if (stack) {
var firstLine = stack.substring(0, stack.indexOf('\n'));
if (message && firstLine.indexOf(message) === -1) {
stack = message + '\n' + stack;
}


return stack.replace(/\n.+\/adapter(\/lib)?\/mocha.js\?\d*\:.+(?=(\n|$))/g, '');
}

return message;
};


var createMochaReporterConstructor = function(tc) {


return function(runner) {










runner.on('start', function() {
tc.info({total: runner.total});
});

runner.on('end', function() {
tc.complete();
});

runner.on('test', function(test) {
test.$errors = [];
});

runner.on('fail', function(test, error) {
if ('hook' == test.type || error.uncaught) {
test.$errors = [formatError(error)];
runner.emit('test end', test);
} else {
test.$errors.push(formatError(error));
}
});

runner.on('test end', function(test) {
var result = {
