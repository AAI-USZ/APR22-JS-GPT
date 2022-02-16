var extend = require('../extend');

extend.helper.register('gist', function(indent, parentBlock, parser){
var args = parser.parseVariable(indent),
id = args[0],
