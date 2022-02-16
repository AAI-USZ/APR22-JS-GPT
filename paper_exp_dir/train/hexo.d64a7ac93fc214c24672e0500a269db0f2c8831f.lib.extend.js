

var _ = require('lodash');



var store = {
generator: [],
renderer: {},
rendererSync: {},
helper: {},
deployer: {},
processor: [],
tag: {},
console: {},
migrator: {},
filter: {
pre: [],
post: []
},
swig: {}
};



exports.generator = {



list: function(){
return store.generator;
},



register: function(fn){
store.generator.push(fn);
}
};



var rendererFn = exports.renderer = {



list: function(){
return store.renderer;
},



register: function(name, output, fn, sync){
if (sync){
store.rendererSync[name] = fn;
store.rendererSync[name].output = output;

store.renderer[name] = function(){
var args = _.toArray(arguments),
callback = args.pop();

try {
callback(null, fn.apply(null, args));
} catch (err){
callback(err);
}
};
} else {
store.renderer[name] = fn;
}

store.renderer[name].output = output;
}
};



exports.rendererSync = {



list: function(){
return store.rendererSync;
},



register: function(name, output, fn){
rendererFn.register(name, output, fn, true);
}
};



exports.tag = {



list: function(){
return store.tag;
},



register: function(name, fn, ends){
store.tag[name] = function(indent, parser){
var args = this.args,
tokenArr = this.tokens && this.tokens.length ? this.tokens : [],
tokens = tokenArr.join(''),
match = tokenArr.join('').match(/^\n(\t*)/),
indent = match ? match[1].length : 0,
raw = [];

tokens.replace(/^\n\t*/, '').replace(/\n\t*$/, '').split('\n').forEach(function(line){
if (indent){
raw.push(line.replace(new RegExp('^\\t{' + indent + '}'), ''));
} else {
