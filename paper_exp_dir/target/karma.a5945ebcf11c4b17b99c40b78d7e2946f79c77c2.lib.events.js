var bindMethod = function(method) {
context.on(helper.camelToSnake(method.substr(2)), function() {
var args = Array.prototype.slice.call(arguments, 0);
