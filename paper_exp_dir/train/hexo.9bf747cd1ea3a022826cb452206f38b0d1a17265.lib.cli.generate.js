var extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
async = require('async'),
publicDir = hexo.public_dir;

extend.console.register('generate', 'Generate static files', function(args){
args = args.join().toLowerCase();

var ignoreTheme = args.match(/-t|--theme/i) ? true : false,
start = new Date();

console.log('Loading.');
hexo.emit('generateBefore');

require('../generate')({ignore: ignoreTheme}, function(){
var list = route.list();

console.log('Generating.');

var queue = async.queue(function(key, next){
list[key](function(err, result){
if (err) throw err;
