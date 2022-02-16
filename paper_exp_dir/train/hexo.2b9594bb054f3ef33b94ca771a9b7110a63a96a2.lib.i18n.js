var render = require('./render'),
format = require('util').format,
fs = require('fs'),
_ = require('underscore');

var i18n = function(namespace){
this.namespace = namespace;
this.store = {};
};

i18n.prototype.get = function(){
var args = _.toArray(arguments),
str = args.shift();

return format.apply(null, args.unshift(this.store[str]));
};

i18n.prototype.set = function(str, result){
this.store[str] = result;
};

i18n.prototype.load = function(path, callback){
var lang = hexo.config && hexo.config.language ? hexo.config.language : 'default',
target = path + '/' + lang + '.yml';

if (_.isFunction(callback)){
render.compile(target, function(err, result){
if (err) throw err;
if (result) this.store = result;
callback(null, result ? true : false);
});
