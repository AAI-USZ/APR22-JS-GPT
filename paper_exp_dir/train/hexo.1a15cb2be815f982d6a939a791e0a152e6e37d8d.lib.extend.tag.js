var ExtendError = require('../error').ExtendError,
types = require('swig/lib/lexer').types;



var Tag = module.exports = function(){


this.store = [];
};



Tag.prototype.list = function(){
return this.store;
};



Tag.prototype.register = function(name, fn, ends){
if (typeof fn !== 'function'){
throw new ExtendError('Tag function is not defined');
}

var tag = {
name: name,
ends: ends
};

tag.parse = function(str, line, parser, types, options){

parser.on('*', function(token){
if (token.type === types.WHITESPACE){
this.out.push(' ');
}

token.type = types.STRING;

return true;
});

return true;
};

tag.compile = function(compiler, args, content, parents, options, blockName){
var tokens = content.join(''),
match = tokens.match(/^\n(\t*)/),
indent = match ? match[1].length : 0,
raw = [];

tokens.replace(/^\n\t/, '').replace(/\n\t*$/, '').split('\n').forEach(function(line){
if (indent){
raw.push(line.replace(new RegExp('^\\t{' + indent + '}'), ''));
} else {
raw.push(line);
}
});

var result = fn(args.join('').split(' '), raw.join('\n'));

if (!result) return '';

result = result
.replace(/\\/g, '\\\\')
.replace(/\n/g, '\\n')
.replace(/\r/g, '\\r')
.replace(/"/g, '\\"');

var out = [
'(function(){',
'_output += "<escape indent=\'' + indent + '\'>' + result + '</escape>";',
'return _output;',
'})();'
].join('\n');

return out;
};

this.store.push(tag);
};
