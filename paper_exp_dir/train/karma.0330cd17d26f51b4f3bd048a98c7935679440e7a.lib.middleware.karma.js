

var path = require('path')
var util = require('util')
var url = require('url')
var useragent = require('useragent')
var _ = require('lodash')

var log = require('../logger').create('middleware:karma')

var urlparse = function (urlStr) {
var urlObj = url.parse(urlStr, true)
urlObj.query = urlObj.query || {}
return urlObj
}

