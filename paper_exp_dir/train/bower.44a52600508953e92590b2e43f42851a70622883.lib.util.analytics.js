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
