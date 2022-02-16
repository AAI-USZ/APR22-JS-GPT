var helpers = require('swig/lib/helpers');

module.exports = function(indent, parser){
var args = this.args,
name = args[0],
operator = args[1],
collection = parser.parseVariable(args[2]);

var loopShared = [
'loop.index = __loopIndex + 1;',
