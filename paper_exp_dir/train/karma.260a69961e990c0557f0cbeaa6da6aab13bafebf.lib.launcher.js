var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');
var log = require('./logger').create('launcher');
var env = process.env;
var fs = require('fs');
var util = require('./util');

var counter = 1;


var Browser = function(id) {
