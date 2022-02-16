
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var log = require('./logger').create('config');
var util = require('./util');
var constant = require('./constants');


var resolveSinglePattern = function(pattern, done) {
var parts = [];
var results = [];
var waiting = 0;





pattern.split(/(\/[^\/\*]*\*[^\/\*]*)/).forEach(function(str) {
if (str) parts.push(str);
});


var finish = function() {
waiting--;
if (!waiting) {


results.sort(function(a, b) {
return a.path > b.path;
});
done(null, results);
}
};


var processPath = function(path, pointer) {
waiting++;

fs.stat(path, function(err, stat) {
if (err) return finish();
if (stat.isDirectory()) {

if (pointer === parts.length) return finish();

var regexp = new RegExp('^' +
parts[pointer].substr(1).
replace(/\./g, '\\.').
replace(/\*/g, '.*') + '$');

fs.readdir(path, function(err, files) {
files.forEach(function(file) {

if (regexp.test(file)) processPath(path + '/' + file, pointer + 1);
});
return finish();
});
return null;
} else {

if (pointer === parts.length) results.push({path: path, mtime: stat.mtime, isUrl: false});
return finish();
}
});
};

return processPath(parts[0], 1);
};


var resolve = function(patterns, exclude, done) {
var resultSets = new Array(patterns.length);
var waiting = 0;

var excludeRegExps = exclude.map(function(pattern) {

return new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
});

patterns.forEach(function(pattern, index) {


if (util.isUrlAbsolute(pattern)) {
resultSets[index] = [{path: pattern, isUrl: true, mtime: null}];
return;
}

waiting++;

resolveSinglePattern(pattern, function(err, files) {
if (!files.length) {
log.warn('Pattern "%s" does not match any file', pattern);
