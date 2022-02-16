var helper = require('./helper');
var events = require('./events');
var logger = require('./logger');


var Result = function() {
var startTime = Date.now();

this.total = this.skipped = this.failed = this.success = 0;
this.netTime = this.totalTime = 0;
this.disconnected = this.error = false;

this.totalTimeEnd = function() {
this.totalTime = Date.now() - startTime;
};
};



var READY = 1;


var EXECUTING = 2;


var READY_DISCONNECTED = 3;


var EXECUTING_DISCONNECTED = 4;


