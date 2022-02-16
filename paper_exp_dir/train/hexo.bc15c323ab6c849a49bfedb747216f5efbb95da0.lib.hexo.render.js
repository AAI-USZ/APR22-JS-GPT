'use strict';

const { extname } = require('path');
const Promise = require('bluebird');
const fs = require('hexo-fs');

const getExtname = str => {
if (typeof str !== 'string') return '';

const ext = extname(str);
return ext[0] === '.' ? ext.slice(1) : ext;
};

const toString = (result, options) => {
if (!Object.prototype.hasOwnProperty.call(options, 'toString') || typeof result === 'string') return result;

if (typeof options.toString === 'function') {
return options.toString(result);
} else if (typeof result === 'object') {
return JSON.stringify(result);
} else if (result.toString) {
