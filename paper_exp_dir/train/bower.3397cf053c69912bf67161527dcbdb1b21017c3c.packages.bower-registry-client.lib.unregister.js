var parseUrl = require('url').parse;
var request = require('request');
var createError = require('./util/createError');

function unregister(name, callback) {
var config = this._config;
var requestUrl = config.registry.register + '/packages/' + name;
var remote = parseUrl(requestUrl);
var headers = {};

if (config.userAgent) {
headers['User-Agent'] = config.userAgent;
}

if (config.accessToken) {
requestUrl += '?access_token=' + config.accessToken;
}

request.del({
url: requestUrl,
proxy: remote.protocol === 'https:' ? config.httpsProxy : config.proxy,
headers: headers,
ca: config.ca.register,
strictSSL: config.strictSsl,
timeout: config.timeout
}, function (err, response) {

if (err) {
