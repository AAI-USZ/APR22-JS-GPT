var extend = require('../extend'),
feedparser = require('feedparser'),
moment = require('moment'),
async = require('async'),
_ = require('underscore');

extend.migrator.register('rss', function(args){
var file = hexo.util.file,
source = args.shift(),
target = args.length ? args.shift() : hexo.source_dir + '_posts/',
start = new Date();

if (!source){
console.log('\nUsage: hexo migrate rss <source> [target]\n\nMore info: http://zespia.tw/hexo/docs/migrate.html\n');
} else {
async.waterfall([
function(next){
console.log('Fetching %s.', source);

