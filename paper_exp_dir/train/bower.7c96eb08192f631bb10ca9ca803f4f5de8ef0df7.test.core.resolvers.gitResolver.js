var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('fs');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Q = require('q');
var mout = require('mout');
var copy = require('../../../lib/util/copy');
var GitResolver = require('../../../lib/core/resolvers/GitResolver');

describe('GitResolver', function () {
var tempDir = path.resolve(__dirname, '../../assets/tmp');
var originalFetchRefs = GitResolver.fetchRefs;

