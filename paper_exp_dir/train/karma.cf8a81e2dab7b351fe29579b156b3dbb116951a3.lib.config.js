var fs = require('fs');
var path = require('path');
var vm = require('vm');
var coffee = require('coffee-script');

var log = require('./logger').create('config');
var helper = require('./helper');
var constant = require('./constants');


var Pattern = function(pattern, served, included, watched) {
this.pattern = pattern;
this.served = helper.isDefined(served) ? served : true;
this.included = helper.isDefined(included) ? included : true;
this.watched = helper.isDefined(watched) ? watched : true;
};

var UrlPattern = function(url) {
Pattern.call(this, url, false, true, false);
};
