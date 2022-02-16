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
var proxyquire = require('proxyquire')
.noCallThru()
.noPreserveCache();
var spawnSync = require('spawn-sync');
var config = require('../lib/config');
var nock = require('nock');
var semver = require('semver');


Q.longStackSupport = true;

