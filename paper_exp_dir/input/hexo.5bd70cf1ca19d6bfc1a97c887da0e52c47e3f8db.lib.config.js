var fs = require('fs'),
async = require('async'),
yaml = require('yamljs'),
sep = require('path').sep;

module.exports = function(root, callback){
async.parallel([
function(next){
fs.readFile(__dirname + '/../package.json', 'utf8', next);
},
function(next){
fs.exists(root + '/_config.yml', function(exist){
if (exist){
fs.readFile(root + '/_config.yml', 'utf8', next);
} else {
next(null, '');
}
});
}
], function(err, result){
if (err) throw err;

var version = JSON.parse(result[0]).version,
config = yaml.parse(result[1]);

