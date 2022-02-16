'use strict';

const Pattern = require('hexo-util').Pattern;
const moment = require('moment-timezone');
const minimatch = require('minimatch');
const _ = require('lodash');

const DURATION_MINUTE = 1000 * 60;

function isTmpFile(path) {
const last = path[path.length - 1];
return last === '%' || last === '~';
}

function isHiddenFile(path) {
return /(^|\/)[_\.]/.test(path);
}

exports.ignoreTmpAndHiddenFile = new Pattern(path => {
if (isTmpFile(path) || isHiddenFile(path)) return false;
return true;
});

exports.isTmpFile = isTmpFile;
exports.isHiddenFile = isHiddenFile;

exports.toDate = date => {
if (!date || moment.isMoment(date)) return date;

if (!(date instanceof Date)) {
date = new Date(date);
}

if (isNaN(date.getTime())) return;

return date;
};

exports.timezone = (date, timezone) => {
if (moment.isMoment(date)) date = date.toDate();

const offset = date.getTimezoneOffset();
