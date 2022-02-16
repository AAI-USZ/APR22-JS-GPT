var mout = require('mout');
var cmd = require('../util/cmd');
var Q = require('q');

var orderByDependencies = function (packages, installed, json) {
var ordered = [];
installed = mout.object.keys(installed);

var depsSatisfied = function (packageName) {
return mout.array.difference(mout.object.keys(packages[packageName].dependencies), installed, ordered).length === 0;
};

var depsFromBowerJson = json && json.dependencies ? mout.object.keys(json.dependencies) : [];
