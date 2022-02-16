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

reader = fstreamIgnore({
path: dir,
type: 'Directory'
});

reader.addIgnoreRules(ignore);
reader.addIgnoreRules(['!bower.json']);


applyIgnores = reader.applyIgnores;
reader.applyIgnores = function (entry) {
var ret = applyIgnores.apply(this, arguments);

if (!ret) {
ignored.push(path.join(dir, entry));
}

