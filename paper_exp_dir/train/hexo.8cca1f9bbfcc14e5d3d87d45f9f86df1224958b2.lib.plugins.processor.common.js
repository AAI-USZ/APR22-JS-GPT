'use strict';

var Pattern = require('hexo-util').Pattern;
var moment = require('moment-timezone');
var minimatch = require('minimatch');
var _ = require('lodash');

var DURATION_MINUTE = 1000 * 60;

function isTmpFile(path) {
var last = path[path.length - 1];
return last === '%' || last === '~';
}

function isHiddenFile(path) {
