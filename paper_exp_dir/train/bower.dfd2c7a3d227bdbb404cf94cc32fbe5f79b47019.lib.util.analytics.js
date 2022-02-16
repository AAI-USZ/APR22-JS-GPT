var Q = require('q');
var mout = require('mout');

var analytics = module.exports;

var insight;



function ensureInsight () {
if (!insight) {
var Insight = require('insight');
var pkg = require('../../package.json');
insight = new Insight({
trackingCode: 'UA-43531210-1',
packageName: pkg.name,
