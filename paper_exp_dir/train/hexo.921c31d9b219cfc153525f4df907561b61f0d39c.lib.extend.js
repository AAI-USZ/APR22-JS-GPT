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
register: function(method){
store.generator.push(method);
}
};

var rendererFn = exports.renderer = {
list: function(){
return store.renderer;
},
register: function(tag, output, method, sync){
if (sync){
store.rendererSync[tag] = method;
store.rendererSync[tag].output = output;

store.renderer[tag] = function(){
var args = _.toArray(arguments),
callback = args.pop();

try {
callback(null, method.apply(null, args));
} catch (err){
callback(err);
}
};
} else {
store.renderer[tag] = method;
}

store.renderer[tag].output = output;
}
};

exports.rendererSync = {
list: function(){
return store.rendererSync;
},
register: function(tag, output, method){
rendererFn.register(tag, method, true);
}
}

exports.tag = {
list: function(){
return store.tag;
},
register: function(tag, method, ends){
store.tag[tag] = function(indent, parser){
var args = this.args,
tokens = this.tokens ? this.tokens.join('') : '',
indent = this.tokens.join('').match(/^\n(\t*)/)[1].length,
raw = [];

tokens.replace(/^\n\t*/, '').replace(/\n\t*$/, '').split('\n').forEach(function(line){
if (indent){
raw.push(line.replace(new RegExp('^\\t{' + indent + '}'), ''));
} else {
raw.push(line);
