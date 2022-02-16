var config = require('./config'),
file = require('./file'),
yfm = require('./yaml-front-matter'),
async = require('async'),
path = require('path'),
ejs = require('ejs'),
marked = require('marked'),
moment = require('moment'),
_ = require('underscore'),
highlight = require('highlight').Highlight,
cache = {};

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

var getLayout = function(layout, callback){
if (cache.hasOwnProperty(layout)){
callback(cache.layout);
} else {
file.read(__dirname + '/../themes/' + config.theme + '/layout/' + layout + '.html', function(err, file){
if (err) throw err;
cache.layout = file;
callback(file);
});
}
};

exports.read = function(source, type, category, callback){
var extname = path.extname(source),
filename = path.basename(source, extname);

async.waterfall([
function(next){
file.read(source, next);
},
function(file, next){
var meta = yfm(file),
entry = marked(meta._content);

delete meta._content;

var locals = meta,
