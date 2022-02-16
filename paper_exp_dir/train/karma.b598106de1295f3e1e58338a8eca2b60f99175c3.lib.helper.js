var fs   = require('fs');
var path = require('path');
var _    = require('lodash');
var useragent = require('useragent');


exports.browserFullNameToShort = function(fullName) {
var agent = useragent.parse(fullName);
return agent.toAgent() + ' (' + agent.os + ')';
};


exports.isDefined = function(value) {
return !_.isUndefined(value);
};

exports.isFunction = _.isFunction;
exports.isString = _.isString;
exports.isObject = _.isObject;
exports.isArray = _.isArray;

var ABS_URL = /^https?:\/\
exports.isUrlAbsolute = function(url) {
return ABS_URL.test(url);
};


exports.camelToSnake = function(camelCase) {
return camelCase.replace(/[A-Z]/g, function(match, pos) {
return (pos > 0 ? '_' : '') + match.toLowerCase();
