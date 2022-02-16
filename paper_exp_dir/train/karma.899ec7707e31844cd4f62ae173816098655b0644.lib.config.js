
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
return new Pattern(pattern);
