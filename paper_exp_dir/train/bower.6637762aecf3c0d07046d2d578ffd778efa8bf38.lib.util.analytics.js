var Q = require('q');
var mout = require('mout');

var analytics = module.exports;
var insight;



analytics.setup = function setup(config) {
var deferred = Q.defer();


if (config.analytics == null) {
var Insight = require('insight');
var pkg = require('../../package.json');
insight = new Insight({
trackingCode: 'UA-43531210-1',
packageName: pkg.name,
packageVersion: pkg.version
});


