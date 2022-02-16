'use strict';

const Pattern = require('hexo-util').Pattern;
const moment = require('moment-timezone');
const minimatch = require('minimatch');

const DURATION_MINUTE = 1000 * 60;

function isTmpFile(path) {
const last = path[path.length - 1];
return last === '%' || last === '~';
}

function isHiddenFile(path) {
return /(^|\/)[_\.]/.test(path);
