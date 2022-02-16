var formatFailedStep = function(step) {

var stack = step.trace.stack;
if (stack) {
if (step.trace.message && stack.indexOf(step.trace.message) === -1) {
stack = step.trace.message + '\n' + stack;
}


return stack.replace(/\n.+jasmine\.js\?\d*\:.+(?=(\n|$))/g, '');
}

return step.trace.message || step.message;
};

var indexOf = function(collection, item) {
if (collection.indexOf) return collection.indexOf(item);

for (var i = 0, ii = collection.length; i < ii; i++) {
if (collection[i] === item) return i;
}

return -1;
};



