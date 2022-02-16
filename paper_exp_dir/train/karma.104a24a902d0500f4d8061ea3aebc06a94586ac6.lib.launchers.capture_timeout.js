var log = require('../logger').create('launcher');


var CaptureTimeoutLauncher = function(timer, captureTimeout) {
if (!captureTimeout) {
return;
}

var self = this;
var pendingTimeoutId = null;

this.on('start', function() {
pendingTimeoutId = timer.setTimeout(function() {
pendingTimeoutId = null;
if (self.state !== self.STATE_BEING_CAPTURED) {
return;
}

log.warn('%s have not captured in %d ms, killing.', self.name, captureTimeout);
self.error = 'timeout';
self.kill();
}, captureTimeout);
});

this.on('done', function() {
if (pendingTimeoutId) {
timer.clearTimeout(pendingTimeoutId);
pendingTimeoutId = null;
}
});
};


CaptureTimeoutLauncher.decoratorFactory = function(timer,
captureTimeout) {
return function(launcher) {
CaptureTimeoutLauncher.call(launcher, timer, captureTimeout);
};
};

CaptureTimeoutLauncher.decoratorFactory.$inject = ['timer', 'config.captureTimeout'];
