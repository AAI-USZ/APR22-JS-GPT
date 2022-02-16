var spawn = require('child_process').spawn;
var path = require('path');
var log = require('../logger').create('launcher');
var fs = require('fs');
var env = process.env;

var BEING_CAPTURED = 1;
var CAPTURED = 2;
var BEING_KILLED = 3;
var FINISHED = 4;
var BEING_TIMEOUTED = 5;


var BaseBrowser = function(id, emitter, captureTimeout, retryLimit) {

var self = this;
var capturingUrl;
var exitCallback = function() {};

this.id = id;
this.state = null;
this._tempDir = path.normalize((env.TMPDIR || env.TMP || env.TEMP || '/tmp') + '/testacular-' +
id.toString());
