var cp = require('child_process');
var path = require('path');
var Q = require('q');
var mout = require('mout');
var which = require('which');
var PThrottler = require('p-throttler');
var createError = require('./createError');








var throttler = new PThrottler(5);

var winBatchExtensions;
var winWhichCache;
var isWin = process.platform === 'win32';

if (isWin) {
winBatchExtensions = ['.bat', '.cmd'];
