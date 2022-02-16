var util = require('util');
var path = require('path');
var fs = require('fs');
var request = require('request');
var Q = require('q');
var mout = require('mout');
var Resolver = require('../Resolver');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

var UrlResolver = function (source, options) {
var pos;
