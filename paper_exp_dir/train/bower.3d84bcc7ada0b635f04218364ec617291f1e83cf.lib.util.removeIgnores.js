var path = require('path');
var rimraf = require('rimraf');
var fstreamIgnore = require('fstream-ignore');
var mout = require('mout');
var Q = require('q');

function removeIgnores(dir, ignore) {
var reader;
var applyIgnores;
var deferred = Q.defer();
var ignored = [];
var nonIgnored = [];
