var path = require('path'),
async = require('async'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

module.exports = function(args){
var target = process.cwd();

if (args[0]) target = path.resolve(target, args[0]);

async.parallel([
function(next){
file.mkdir(target + '/themes', function(){
spawn('git', ['clone', 'git://github.com/tommy351/hexo-theme-light.git', target + '/themes/light'], {},
function(data){
console.log(data);
},
function(data){
console.log(data);
},
function(code){
if (code == 0) next();
else console.log(code);
}
);
