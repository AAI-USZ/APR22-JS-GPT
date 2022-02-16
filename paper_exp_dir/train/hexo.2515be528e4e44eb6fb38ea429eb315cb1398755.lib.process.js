var async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
extend = require('./extend'),
processor = extend.processor.list(),
processorLength = processor.length,
sourceDir = hexo.source_dir,
EOL = require('os').EOL,
EOLre = new RegExp(EOL, 'g');

var getProcessor = function(path){
var tasks = [];

for (var i=0; i<processorLength; i++){
var item = processor[i],
rule = item.rule,
params = [],
match = false;

if (_.isRegExp(rule)){
if (rule.test(path)){
params = path.match(rule);
match = true;
}
} else {
if (rule === ''){
match = true;
} else {
var arr = rule.match(/:([^\/]+)/g),
regex = new RegExp(rule);

if (regex.test(path)){
var exec = path.match(regex);
match = true;
for (var i=0, len=arr.length; i<len; i++){
params[arr[i]] = exec[i + 1];
}
}
}
}

if (match){
tasks.push({
fn: item,
rule: item.rule,
params: params
});
}
}

return tasks;
};

module.exports = function(files, callback){
if (!Array.isArray(files)) files = [files];

hexo.emit('processBefore');

async.forEach(files, function(item, next){
if (_.isObject(item)){
var path = item.path,
type = item.type;
} else {
var path = item,
type = 'update';
}

var source = sourceDir + path;

fs.exists(source, function(exist){
if (!exist) return next();
var tasks = getProcessor(path);
if (!tasks.length) return next();

var obj = {
source: source,
path: path,
