var formatFailedStep = function(step) {

var stack = step.trace.stack;
var message = step.message;
if (stack) {

var firstLine = stack.substring(0, stack.indexOf('\n') - 1);
if (message && message.indexOf(firstLine) == -1) {
stack = message + '\n' + stack;
}


return stack.replace(/\n.+jasmine\.js\?\d*\:.+(?=(\n|$))/g, '');
}
