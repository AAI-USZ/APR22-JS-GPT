var util = require('util');
var path = require('path');
var fs = require('graceful-fs');
var url = require('url');
var request = require('request');
var Q = require('q');
var mout = require('mout');
var junk = require('junk');
var Resolver = require('./Resolver');
var download = require('../../util/download');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

function UrlResolver(decEndpoint, config, logger) {
var pos;

Resolver.call(this, decEndpoint, config, logger);

