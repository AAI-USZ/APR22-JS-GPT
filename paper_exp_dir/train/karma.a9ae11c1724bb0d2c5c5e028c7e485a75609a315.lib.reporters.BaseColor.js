var colors = require('colors');

var BaseColorReporter = function() {
this.SPEC_FAILURE = '%s %s FAILED'.red + '\n';
this.SPEC_SLOW = '%s SLOW %s: %s'.yellow + '\n';
this.ERROR = '%s ERROR'.red + '\n';

this.FINISHED_ERROR = ' ERROR'.red;
this.FINISHED_SUCCESS = ' SUCCESS'.green;
this.FINISHED_DISCONNECTED = ' DISCONNECTED'.red;
