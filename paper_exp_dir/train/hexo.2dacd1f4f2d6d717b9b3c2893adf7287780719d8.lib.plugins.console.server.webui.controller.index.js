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
controller = args.pop();

if (typeof controller === 'string'){
var action = controller.split('#'),
fn = require('./' + action[0])[action[1]];
} else {
var fn = controller;
}
