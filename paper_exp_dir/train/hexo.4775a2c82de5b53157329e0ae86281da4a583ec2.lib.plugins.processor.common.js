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
const last = path[path.length - 1];
return last === '%' || last === '~';
}
