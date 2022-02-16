
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var coffee = require('coffee-script');
var log = require('./logger').create('config');
var util = require('./util');
var constant = require('./constants');


var Pattern = function(pattern, served, included, watched) {
this.pattern = pattern;
this.served = util.isDefined(served) ? served : true;
this.included = util.isDefined(included) ? included : true;
this.watched = util.isDefined(watched) ? watched : true;
};


var createPatternObject = function(pattern) {
if (util.isString(pattern)) {
return util.isUrlAbsolute(pattern) ?
new Pattern(pattern, false, true, false) :
new Pattern(pattern);
}

if (util.isObject(pattern)) {
if (!util.isDefined(pattern.pattern)) {
log.warn('Invalid pattern %s!\n\tObject is missing "pattern" property".', pattern);
}

