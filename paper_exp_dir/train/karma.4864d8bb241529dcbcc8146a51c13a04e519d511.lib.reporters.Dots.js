var BaseReporter = require('./Base');


var DotsReporter = function(formatError, reportSlow) {
BaseReporter.call(this, formatError, reportSlow);

var DOTS_WRAP = 80;

this.onRunStart = function(browsers) {
this.browsers_ = browsers;
this.dotsCount_ = 0;
};
