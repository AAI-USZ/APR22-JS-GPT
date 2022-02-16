'use strict';

var stripIndent = require('strip-indent');
var nunjucks = require('nunjucks');
var inherits = require('util').inherits;
var Promise = require('bluebird');

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

var tag;

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
} else {
if (options.ends) {
tag = new NunjucksBlock(name, fn);
} else {
tag = new NunjucksTag(name, fn);
}
}

this.env.addExtension(name, tag);
};

var placeholder = '\uFFFC';
var rPlaceholder = /(?:<|&lt;)\!--\uFFFC(\d+)--(?:>|&gt;)/g;

Tag.prototype.render = function(str, options, callback) {
if (!callback && typeof options === 'function') {
callback = options;
options = {};
}

var cache = [];
