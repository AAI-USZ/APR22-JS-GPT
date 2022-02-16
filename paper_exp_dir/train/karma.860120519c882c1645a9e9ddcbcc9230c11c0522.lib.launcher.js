var exec = require('child_process').exec;
var path = require('path');
var log = require('./logger').create('launcher');
var env = process.env;
var fs = require('fs');
var util = require('./util');

var counter = 1;


var Browser = function(id) {

var exitCallback = function() {};

this._getCommand = function() {
var cmd = env[this.ENV_CMD] || this.DEFAULT_CMD[process.platform];
