var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

var log = require('../logger').create('launcher');
var env = process.env;

var BEING_CAPTURED = 1;
var CAPTURED = 2;
var BEING_KILLED = 3;
var FINISHED = 4;
