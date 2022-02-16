var cp = require('child_process');
var path = require('path');
var Q = require('q');
var mout = require('mout');
var which = require('which');
var createError = require('./createError');





var openLimit = 50;
var openHandles = 0;
var queue = [];
var winBatchExtensions;
var winWhichCache;
var isWin = process.platform === 'win32';

