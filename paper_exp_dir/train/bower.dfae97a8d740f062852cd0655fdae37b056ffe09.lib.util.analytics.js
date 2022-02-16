var Q = require('q');
var Insight = require('insight');
var mout = require('mout');
var config = require('../config');
var pkg = require('../../package.json');

var analytics = module.exports;
var insight;



analytics.setup = function setup() {
var deferred = Q.defer();
insight = new Insight({
trackingCode: 'UA-43531210-1',
packageName: pkg.name,
packageVersion: pkg.version
});



if (insight.optOut === undefined && config.analytics) {
insight.askPermission(null, deferred.resolve);
} else {
deferred.resolve();
}

return deferred.promise;
};

var Tracker = analytics.Tracker = function Tracker(config) {
if (!config.analytics) {
this.track = function noop() {};
}
};

Tracker.prototype.track = function track() {
if (!insight) {
throw new Error('You must call analytics.setup() prior to tracking.');
}
insight.track.apply(insight, arguments);
};

Tracker.prototype.trackDecomposedEndpoints = function trackDecomposedEndpoints(command, endpoints) {
endpoints.forEach(function (endpoint) {
this.track(command, endpoint.source, endpoint.target);
}.bind(this));
};

Tracker.prototype.trackPackages = function trackPackages(command, packages) {
mout.object.forOwn(packages, function (package) {
var meta = package.pkgMeta;
this.track(command, meta.name, meta.version);
}.bind(this));
};

Tracker.prototype.trackNames = function trackNames(command, names) {
names.forEach(function (name) {
this.track(command, name);
}.bind(this));
};
