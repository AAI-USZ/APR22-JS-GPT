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

Tag.prototype.render = function(str, options, callback) {
if (!callback && typeof options === 'function') {
callback = options;
options = {};
}

var env = this.env;

return new Promise(function(resolve, reject) {
env.renderString(str, options, function(err, result) {
if (err) return reject(err);
resolve(result);
});
});
};

function NunjucksTag(name, fn) {
this.tags = [name];
this.fn = fn;
}

NunjucksTag.prototype.parse = function(parser, nodes, lexer) {
var node = this._parseArgs(parser, nodes, lexer);

return new nodes.CallExtension(this, 'run', node, []);
};

NunjucksTag.prototype._parseArgs = function(parser, nodes, lexer) {
var tag = parser.nextToken();
var node = new nodes.NodeList(tag.lineno, tag.colno);
var token;

var argarray = new nodes.Array(tag.lineno, tag.colno);

var argitem = '';
while ((token = parser.nextToken(true))) {
if (token.type === lexer.TOKEN_WHITESPACE || token.type === lexer.TOKEN_BLOCK_END) {
if (argitem !== '') {
var argnode = new nodes.Literal(tag.lineno, tag.colno, argitem.trim());
argarray.addChild(argnode);
argitem = '';
}

if (token.type === lexer.TOKEN_BLOCK_END) {
break;
}
} else {
argitem += token.value;
}
}

