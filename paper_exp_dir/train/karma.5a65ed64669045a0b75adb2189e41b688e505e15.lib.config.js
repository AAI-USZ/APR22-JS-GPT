
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var log = require('./logger').create('config');
var util = require('./util');


var resolveSinglePattern = function(pattern, done) {
var parts = [];
var results = [];
var waiting = 0;





pattern.split(/(\/[^\/\*]*\*[^\/\*]*)/).forEach(function(str) {
if (str) parts.push(str);
});
