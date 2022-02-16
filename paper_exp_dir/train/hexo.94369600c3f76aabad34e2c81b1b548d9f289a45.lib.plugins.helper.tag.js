var _ = require('lodash'),
pathFn = require('path'),
url = require('url'),
qs = require('querystring'),
util = require('../../util'),
htmlTag = util.html_tag;

var mergeAttrs = function(options, attrs){
if (options.class){
var classes = options.class;

if (Array.isArray(classes)){
attrs.class = classes.join(' ');
} else {
attrs.class = classes;
}
}

if (options.id) attrs.id = options.id;
};

exports.css = function(){
var args = _.flatten(_.toArray(arguments)),
config = this.config || hexo.config,
root = config.root,
out = [],
self = this;

args.forEach(function(path){
if (pathFn.extname(path) !== '.css') path += '.css';

out.push(htmlTag('link', {
rel: 'stylesheet',
href: self.url_for(path),
type: 'text/css'
