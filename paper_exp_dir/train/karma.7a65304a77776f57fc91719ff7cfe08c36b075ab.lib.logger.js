






var log4js = require('log4js');
var helper = require('./helper');
var constant = require('./constants');


var LogWrapper = function(name, level) {
this.logger = log4js.getLogger(name);
this.logger.setLevel(level);
};
['error', 'warn', 'info', 'debug'].forEach(function(level) {
LogWrapper.prototype[level] = function() {
this.logger[level].apply(this.logger, arguments);
};
});













var setup = function(level, colors, appenders) {

var pattern = colors ? constant.COLOR_PATTERN : constant.NO_COLOR_PATTERN;


appenders = helper.isDefined(appenders) ? appenders : [constant.CONSOLE_APPENDER];

appenders = appenders.map(function(appender) {
if(appender.type === 'console') {
if (helper.isDefined(appender.layout) && appender.layout.type === 'pattern') {
appender.layout.pattern = pattern;
}
}
return appender;
});


log4js.setGlobalLogLevel(level);
log4js.configure({
appenders: appenders
});
};






var create = function(name, level) {
if (name === 'socket.io') {
return new LogWrapper('socket.io', level);
} else {
var logger = log4js.getLogger(name || 'karma');
if (helper.isDefined(level)) {
logger.setLevel(level);
}
return logger;
}
};




exports.create = create;
exports.setup = setup;
