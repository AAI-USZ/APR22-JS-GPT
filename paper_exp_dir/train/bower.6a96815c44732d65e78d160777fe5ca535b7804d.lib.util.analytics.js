var Q = require('q');
var mout = require('mout');

var analytics = module.exports;

var insight;

var enableAnalytics = false;













function ensureInsight () {
if (!insight) {
var Insight = require('insight');
insight = new Insight({
trackingCode: 'UA-43531210-1',
pkg: require('../../package.json')
});
}
}





analytics.setup = function setup (config) {
var deferred = Q.defer();
