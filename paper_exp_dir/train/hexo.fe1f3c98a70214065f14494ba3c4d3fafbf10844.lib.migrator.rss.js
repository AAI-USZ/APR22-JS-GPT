var extend = require('../extend'),
feedparser = require('feedparser'),
moment = require('moment'),
async = require('async'),
_ = require('underscore');

extend.migrator.register('rss', function(args){
var file = hexo.util.file,
source = args.shift(),
target = hexo.source_dir + '_posts/',
start = new Date();

if (!source){
console.log('\nUsage: hexo migrate rss <source>\n\nMore info: http://zespia.tw/hexo/docs/migrate.html\n');
} else {
async.waterfall([
function(next){
console.log('Fetching %s.', source);


if (source.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/)){
feedparser.parseUrl(source, next);
} else {
feedparser.parseFile(source, next);
}
},
function(meta, posts, next){
console.log('Analyzing.');

