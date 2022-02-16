var extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
async = require('async'),
fs = require('fs'),
_ = require('underscore'),
publicDir = hexo.public_dir;

extend.console.register('generate', 'Generate static files', function(args){
args = args.join().toLowerCase();

var ignoreTheme = args.match(/-t|--theme/i) ? true : false,
start = new Date();

console.log('Loading.');
hexo.emit('generateBefore');

require('../generate')({ignore: ignoreTheme}, function(err, cache){
var list = route.list(),
keys = Object.keys(list);

if (ignoreTheme) keys = _.difference(keys, cache);

hexo.emit('generate');
console.log('Generating.');

async.waterfall([
function(next){
fs.exists(publicDir, function(exist){
if (!exist) return next();
file.empty(publicDir, keys, next);
