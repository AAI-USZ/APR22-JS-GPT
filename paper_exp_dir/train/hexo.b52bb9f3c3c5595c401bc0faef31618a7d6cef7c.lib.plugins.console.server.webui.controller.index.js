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
