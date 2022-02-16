var Configstore = require('configstore');
var GitHub = require('github');
var Q = require('q');

var createError = require('../util/createError');
var defaultConfig = require('../config');

function login(logger, options, config) {
var configstore = new Configstore('bower-github');

config = defaultConfig(config);

var promise;

options = options || {};

if (options.token) {
promise = Q.resolve({ token: options.token });
} else {

if (!config.interactive) {
logger.emit('error', createError('Login requires an interactive shell', 'ENOINT', {
details: 'Note that you can manually force an interactive shell with --config.interactive'
}));
