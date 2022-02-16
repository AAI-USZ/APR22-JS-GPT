
var extend = require('../extend'),
renderer = Object.keys(extend.renderer.list()),
tag = extend.tag.list(),
render = require('../render'),
route = require('../route'),
Collection = require('../model').Collection,
util = require('../util'),
file = util.file,
yfm = util.yfm,
highlight = util.highlight,
pathFn = require('path'),
sep = pathFn.sep,
fs = require('graceful-fs'),
swig = require('swig'),
async = require('async'),
moment = require('moment'),
_ = require('underscore'),
config = hexo.config,
sourceDir = hexo.source_dir,
publicDir = hexo.public_dir,
catDir = config.category_dir,
tagDir = config.tag_dir + '/',
siteUrl = config.url + '/',
configLink = config.permalink;

swig.init({tags: tag});

var regex = {
codeBlock: /`{3} *([^\n]+)?\n(.+?)\n`{3}/,
AllOptions: /([^\s]+)\s+(.+?)(https?:\/\/\S+)\s*(.+)?/i,
LangCaption: /([^\s]+)\s*(.+)?/i
};

if (config.new_post_name){
var configNewPostLink = config.new_post_name;

var filenameRE = pathFn.basename(configNewPostLink, pathFn.extname(configNewPostLink))
.replace(':year', '\\d{4}')
.replace(/:(month|day)/g, '\\d{2}')
.replace(':title', '(.*)');

filenameRE = new RegExp(filenameRE);
}

var load = function(source, callback){
