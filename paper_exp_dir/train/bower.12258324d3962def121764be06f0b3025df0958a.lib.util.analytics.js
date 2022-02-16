var Q = require('q');
var mout = require('mout');

var analytics = module.exports;

var insight;

var enableAnalytics = false;














function ensureInsight () {
if (!insight) {
var Insight = require('insight');

if (process.env.NODE_ENV === 'test') {
insight = new Insight({
trackingCode: 'UA-00000000-0',
pkg: {
name: 'bower-test',
version: '1.0.0'
}
});

insight.config.clear();
} else {
insight = new Insight({
trackingCode: 'UA-43531210-1',
pkg: require('../../package.json')
});
}
}
}





analytics.setup = function setup (config) {
var deferred = Q.defer();


if (config.analytics === undefined) {
ensureInsight();


if (config.interactive) {
if (insight.optOut !== undefined) {
deferred.resolve(!insight.optOut);
} else {
insight.askPermission(null, function(err, optIn) {


deferred.resolve(optIn);
});
}
} else {


deferred.resolve(false);
}
} else {

deferred.resolve(config.analytics);
}

return deferred.promise.then(function (enabled) {
enableAnalytics = enabled;

return enabled;
});
};

var Tracker = analytics.Tracker = function Tracker (config) {
function analyticsEnabled () {

if (config && config.analytics !== undefined) {
return config.analytics;
}


return enableAnalytics;
}

if (analyticsEnabled()) {
ensureInsight();
} else {
this.track = function noop () {};
this.trackDecomposedEndpoints = function noop () {};
this.trackPackages = function noop () {};
this.trackNames = function noop () {};
}
};

Tracker.prototype.track = function track () {
insight.track.apply(insight, arguments);
};

Tracker.prototype.trackDecomposedEndpoints = function trackDecomposedEndpoints (command, endpoints) {
endpoints.forEach(function (endpoint) {
this.track(command, endpoint.source, endpoint.target);
}.bind(this));
};

Tracker.prototype.trackPackages = function trackPackages (command, packages) {
mout.object.forOwn(packages, function (_package) {
var meta = _package.pkgMeta;
this.track(command, meta.name, meta.version);
}.bind(this));
};

Tracker.prototype.trackNames = function trackNames (command, names) {
names.forEach(function (name) {
this.track(command, name);
}.bind(this));
};
