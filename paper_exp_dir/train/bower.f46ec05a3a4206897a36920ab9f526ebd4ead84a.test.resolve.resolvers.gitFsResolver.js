var path = require('path');
var fs = require('fs');
var expect = require('expect.js');
var path = require('path');
var fetchBranch = require('../../util/fetchBranch');
var GitFsResolver = require('../../../lib/resolve/resolvers/GitFsResolver');

describe('GitFsResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/github-test-package');

