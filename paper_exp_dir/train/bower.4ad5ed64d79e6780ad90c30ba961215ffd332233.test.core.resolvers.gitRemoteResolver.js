var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var Logger = require('bower-logger');
var helpers = require('../../helpers');
var Q = require('q');
var mout = require('mout');
var multiline = require('multiline').stripIndent;
var GitRemoteResolver = require('../../../lib/core/resolvers/GitRemoteResolver');
var defaultConfig = require('../../../lib/config');

describe('GitRemoteResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var logger;

before(function () {
