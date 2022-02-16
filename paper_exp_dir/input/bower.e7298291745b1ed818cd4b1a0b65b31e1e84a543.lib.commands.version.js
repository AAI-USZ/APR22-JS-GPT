var semver = require('semver');
var which = require('which');
var fs = require('../util/fs');
var path = require('path');
var Q = require('q');
var execFile = require('child_process').execFile;
