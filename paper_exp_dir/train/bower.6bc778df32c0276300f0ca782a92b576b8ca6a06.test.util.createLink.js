var path = require('path');
var Q = require('q');
var fs = require('fs');
var expect = require('expect.js');
var helpers = require('../helpers');
var createLink = require('../../lib/util/createLink');

describe('createLink', function() {
var srcDir = new helpers.TempDir({
someFile: 'Hello World',
someDirectory: {
otherFile: 'Hello World'
}
});

var dstDir = new helpers.TempDir();

