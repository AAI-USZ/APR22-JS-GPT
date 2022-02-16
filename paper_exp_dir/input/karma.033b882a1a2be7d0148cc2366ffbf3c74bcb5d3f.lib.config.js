var path = require('path');

var logger = require('./logger');
var log = logger.create('config');
var helper = require('./helper');
var constant = require('./constants');



require('coffee-script');


var Pattern = function(pattern, served, included, watched) {
this.pattern = pattern;
this.served = helper.isDefined(served) ? served : true;
this.included = helper.isDefined(included) ? included : true;
this.watched = helper.isDefined(watched) ? watched : true;
};

var UrlPattern = function(url) {
Pattern.call(this, url, false, true, false);
};


var createPatternObject = function(pattern) {
if (helper.isString(pattern)) {
return helper.isUrlAbsolute(pattern) ? new UrlPattern(pattern) : new Pattern(pattern);
}

if (helper.isObject(pattern)) {
if (!helper.isDefined(pattern.pattern)) {
log.warn('Invalid pattern %s!\n\tObject is missing "pattern" property".', pattern);
}

return helper.isUrlAbsolute(pattern.pattern) ?
new UrlPattern(pattern.pattern) :
new Pattern(pattern.pattern, pattern.served, pattern.included, pattern.watched);
}

log.warn('Invalid pattern %s!\n\tExpected string or object with "pattern" property.', pattern);
return new Pattern(null, false, false, false);
};

