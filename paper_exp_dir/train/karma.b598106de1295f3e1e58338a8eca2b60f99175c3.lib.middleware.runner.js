

var path = require('path');
var helper = require('../helper');
var log = require('../logger').create();
var constant = require('../constants');
var json = require('connect').json();

var createRunnerMiddleware = function(emitter, fileList, capturedBrowsers, reporter,
hostname,   port,   urlRoot, config) {

return function(request, response, next) {

