

var path = require('path');
var util = require('util');
var url = require('url');

var urlparse = function(urlStr) {
var urlObj = url.parse(urlStr, true);
urlObj.query = urlObj.query || {};
return urlObj;
};

var common = require('./common');

var VERSION = require('../constants').VERSION;
