'use strict';

const stripIndent = require('strip-indent');
const chalk = require('chalk');
const nunjucks = require('nunjucks');
const { inherits } = require('util');
const Promise = require('bluebird');

function Tag() {
this.env = new nunjucks.Environment(null, {
autoescape: false
});
}

Tag.prototype.register = function(name, fn, options) {
if (!name) throw new TypeError('name is required');
if (typeof fn !== 'function') throw new TypeError('fn must be a function');

if (options == null || typeof options === 'boolean') {
options = {ends: options};
}

let tag;

if (options.async) {
if (fn.length > 2) {
fn = Promise.promisify(fn);
} else {
fn = Promise.method(fn);
}

if (options.ends) {
tag = new NunjucksAsyncBlock(name, fn);
} else {
tag = new NunjucksAsyncTag(name, fn);
}
} else if (options.ends) {
tag = new NunjucksBlock(name, fn);
} else {
tag = new NunjucksTag(name, fn);
}

this.env.addExtension(name, tag);
};

const placeholder = '\uFFFC';
const rPlaceholder = /(?:<|&lt;)!--\uFFFC(\d+)--(?:>|&gt;)/g;

function getContextLineNums(min, max, center, amplitude) {
const result = [];
let lbound = Math.max(min, center - amplitude);
const hbound = Math.min(max, center + amplitude);
while (lbound <= hbound) result.push(lbound++);
return result;
}

const LINES_OF_CONTEXT = 5;
function getContext(lines, errLine, location, type) {
const colorize = chalk.cyan;
const message = [
location + ' ' + type,
