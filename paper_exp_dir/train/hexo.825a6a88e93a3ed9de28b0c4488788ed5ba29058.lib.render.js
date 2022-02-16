var config = require('./config'),
file = require('./file'),
theme = require('./theme'),
yfm = require('./yaml-front-matter'),
async = require('async'),
path = require('path'),
ejs = require('ejs'),
marked = require('marked'),
moment = require('moment'),
_ = require('underscore'),
highlight = require('highlight').Highlight;

var regex = {
excerpt: /<!--\s*more\s*-->/
};

marked.setOptions({
gfm: true,
pedantic: false,
sanitize: false,
highlight: function(code){
return highlight(code);
}
});

exports.read = function(source, type, category, callback){
