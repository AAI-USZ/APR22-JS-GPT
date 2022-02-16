var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var nock = require('nock');
var Q = require('q');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var UrlResolver = require('../../../lib/core/resolvers/UrlResolver');
var defaultConfig = require('../../../lib/config');

describe('UrlResolver', function () {
