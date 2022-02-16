var expect = require('expect.js');
var path = require('path');
var Logger = require('bower-logger');
var createError = require('../../../lib/util/createError');
var pluginResolverFactory = require('../../../lib/core/resolvers/pluginResolverFactory');
var defaultConfig = require('../../../lib/config');
var Q = require('q');

describe('pluginResolverFactory', function() {
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var logger;

before(function() {
logger = new Logger();
});

afterEach(function() {
logger.removeAllListeners();
});

var mockPluginResolver = function resolver(bower) {
return {
match: function(source) {
return true;
},

locate: function(source) {
return source;
