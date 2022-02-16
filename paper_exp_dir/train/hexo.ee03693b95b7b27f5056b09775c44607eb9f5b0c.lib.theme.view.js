var async = require('async'),
pathFn = require('path'),
_ = require('lodash');


var View = module.exports = function View(source, path, theme){

this.source = source;


this.path = path;


this.extname = pathFn.extname(path);


this.theme = theme;


this.data = null;


this.cache = null;
};


View.prototype.render = function(options, callback){
if (!callback){
if (typeof options === 'function'){
callback = options;
options = {};
} else {
callback = function(){};
}
}

options = _.extend({
cache: true
}, options);

var data = this.data;
if (!data) return callback();

var layout = data.hasOwnProperty('layout') ? data.layout : options.layout,
locals = _.extend(this._buildLocals(options), _.omit(data, 'layout', '_content'), {filename: this.source}),
self = this;

hexo.render.render({
path: this.source,
