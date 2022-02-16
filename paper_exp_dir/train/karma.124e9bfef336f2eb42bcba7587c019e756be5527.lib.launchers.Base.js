var spawn = require('child_process').spawn;
var path = require('path');
var log = require('../logger').create('launcher');
var fs = require('fs');
var rimraf = require('rimraf');
var env = process.env;

var BEING_CAPTURED = 1;
var CAPTURED = 2;
var BEING_KILLED = 3;
var FINISHED = 4;
var BEING_TIMEOUTED = 5;


var BaseBrowser = function(id, emitter, captureTimeout, retryLimit) {
