var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var GitRemoteResolver = require('../../../lib/core/resolvers/GitRemoteResolver');
var Logger = require('../../../lib/core/Logger');
var defaultConfig = require('../../../lib/config');

describe('GitRemoteResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

