'use strict';

const stripIndent = require('strip-indent');
const nunjucks = require('nunjucks');
const inherits = require('util').inherits;
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
} else {
if (options.ends) {
tag = new NunjucksBlock(name, fn);
} else {
tag = new NunjucksTag(name, fn);
}
}

this.env.addExtension(name, tag);
};

const placeholder = '\uFFFC';
const rPlaceholder = /(?:<|&lt;)!--\uFFFC(\d+)--(?:>|&gt;)/g;

Tag.prototype.render = function(str, options, callback) {
if (!callback && typeof options === 'function') {
callback = options;
options = {};
}

const cache = [];

const escapeContent = str => `<!--${placeholder}${cache.push(str) - 1}-->`;

str = str.replace(/<pre><code.*>[\s\S]*?<\/code><\/pre>/gm, escapeContent);

return Promise.fromCallback(cb => { this.env.renderString(str, options, cb); })
.then(result => result.replace(rPlaceholder, (_, index) => cache[index]));
};

function NunjucksTag(name, fn) {
this.tags = [name];
this.fn = fn;
