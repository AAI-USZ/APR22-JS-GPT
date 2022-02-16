'use strict';

const { Pattern } = require('hexo-util');
const moment = require('moment-timezone');
const micromatch = require('micromatch');

const DURATION_MINUTE = 1000 * 60;

function isMatch(path, patterns) {
if (!patterns) return false;

return micromatch.isMatch(path, patterns);
}

function isTmpFile(path) {
return path.endsWith('%') || path.endsWith('~');
}

function isHiddenFile(path) {
return /(^|\/)[_.]/.test(path);
}

function isExcludedFile(path, config) {
if (isTmpFile(path)) return true;
if (isMatch(path, config.exclude)) return true;
