

var extend = require('../extend'),
renderer = Object.keys(extend.renderer.list()),
tag = extend.tag.list(),
render = require('../render'),
util = require('../util'),
file = util.file,
yfm = util.yfm,
highlight = util.highlight,
path = require('path'),
fs = require('fs'),
async = require('async'),
swig = require('swig'),
_ = require('underscore'),
config = hexo.config;

swig.init({tags: tag});

var regex = {
codeBlock: /`{3} *([^\n]+)?\n(.+?)\n`{3}/,
AllOptions: /([^\s]+)\s+(.+?)(https?:\/\/\S+)\s*(.+)?/i,
LangCaption: /([^\s]+)\s*(.+)?/i
};
