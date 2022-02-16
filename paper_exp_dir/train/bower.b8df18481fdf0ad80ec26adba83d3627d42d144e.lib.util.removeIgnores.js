var path = require('path');
var rimraf = require('rimraf');
var fstreamIgnore = require('fstream-ignore');
var mout = require('mout');
var Q = require('q');

function removeIgnores(dir, meta) {
var reader;
var applyIgnores;
var deferred = Q.defer();
var ignored = [];
var nonIgnored = ['bower.json'];


nonIgnored = nonIgnored.concat(meta.main || []);

nonIgnored = nonIgnored.map(function (file) {
return path.join(dir, file);
});

reader = fstreamIgnore({
