var expect = require('expect.js');
var path = require('path');
var helpers = require('../helpers');
var nock = require('nock');
var fs = require('../../lib/util/fs');

describe('bower install', function() {

var tempDir = new helpers.TempDir();

var install = helpers.command('install', {
