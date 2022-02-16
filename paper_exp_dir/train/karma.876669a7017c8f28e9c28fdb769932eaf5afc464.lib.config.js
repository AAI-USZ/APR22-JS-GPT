
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var EventEmitter = require('events').EventEmitter;
var log = require('./logger').create('config');


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
