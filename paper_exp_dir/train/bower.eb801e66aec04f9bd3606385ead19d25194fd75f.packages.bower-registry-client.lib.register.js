var parseUrl = require('url').parse;
var request = require('request');
var createError = require('./util/createError');

function register(name, url, callback) {
var config = this._config;
var requestUrl = config.registry.register + '/packages';
var remote = parseUrl(requestUrl);
var headers = {};

if (config.userAgent) {
headers['User-Agent'] = config.userAgent;
