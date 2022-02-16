require('chalk').enabled = false;

var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('../lib/util/rimraf');
var uuid = require('node-uuid');
var object = require('mout/object');
var fs = require('../lib/util/fs');
var glob = require('glob');
var os = require('os');
var which = require('which');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var spawnSync = require('spawn-sync');
var config = require('../lib/config');
var nock = require('nock');


Q.longStackSupport = true;


var env = {
'GIT_AUTHOR_DATE': 'Sun Apr 7 22:13:13 2013 +0000',
'GIT_AUTHOR_NAME': 'André Cruz',
'GIT_AUTHOR_EMAIL': 'amdfcruz@gmail.com',
'GIT_COMMITTER_DATE': 'Sun Apr 7 22:13:13 2013 +0000',
'GIT_COMMITTER_NAME': 'André Cruz',
