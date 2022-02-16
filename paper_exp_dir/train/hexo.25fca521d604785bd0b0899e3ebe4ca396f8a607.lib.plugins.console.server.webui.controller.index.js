var _ = require('lodash');

var formatPath = function(path){
return path.replace(/\/*$/, '/');
};

function Controller(app, base, middlewares){
this.app = app;
this.middlewares = middlewares || [];

if (base){
this.base = formatPath(base);
} else {
this.base = '/';
}
};

['get', 'post', 'put', 'del', 'use'].forEach(function(i){
Controller.prototype[i] = function(){
var args = _.toArray(arguments),
path = args.shift(),
arr = [];

args.forEach(function(item){
if (typeof item === 'string'){
var actions = item.split('#'),
fn = require('./' + actions.shift());

actions.forEach(function(act){
fn = fn[act];
});

