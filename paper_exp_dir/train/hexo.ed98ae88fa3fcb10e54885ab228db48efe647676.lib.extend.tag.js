'use strict';

const { stripIndent } = require('hexo-util');
const { cyan } = require('chalk');
const nunjucks = require('nunjucks');
const Promise = require('bluebird');
const placeholder = '\uFFFC';
const rPlaceholder = /(?:<|&lt;)!--\uFFFC(\d+)--(?:>|&gt;)/g;

class NunjucksTag {
constructor(name, fn) {
this.tags = [name];
this.fn = fn;
}

parse(parser, nodes, lexer) {
const node = this._parseArgs(parser, nodes, lexer);

return new nodes.CallExtension(this, 'run', node, []);
}

_parseArgs(parser, nodes, lexer) {
const tag = parser.nextToken();
const node = new nodes.NodeList(tag.lineno, tag.colno);
const argarray = new nodes.Array(tag.lineno, tag.colno);

let token;
let argitem = '';

while ((token = parser.nextToken(true))) {
if (token.type === lexer.TOKEN_WHITESPACE || token.type === lexer.TOKEN_BLOCK_END) {
if (argitem !== '') {
const argnode = new nodes.Literal(tag.lineno, tag.colno, argitem.trim());
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

node.addChild(argarray);

return node;
}

run(context, args) {
return this._run(context, args, '');
}

_run(context, args, body) {
return Reflect.apply(this.fn, context.ctx, [args, body]);
}
}

const trimBody = body => {
return stripIndent(body()).replace(/^\n?|\n?$/g, '');
};

class NunjucksBlock extends NunjucksTag {
parse(parser, nodes, lexer) {
const node = this._parseArgs(parser, nodes, lexer);
const body = this._parseBody(parser, nodes, lexer);

return new nodes.CallExtension(this, 'run', node, [body]);
}

_parseBody(parser, nodes, lexer) {
const body = parser.parseUntilBlocks(`end${this.tags[0]}`);

parser.advanceAfterBlockEnd();
return body;
}

run(context, args, body) {
return this._run(context, args, trimBody(body));
}
}

class NunjucksAsyncTag extends NunjucksTag {
parse(parser, nodes, lexer) {
const node = this._parseArgs(parser, nodes, lexer);

return new nodes.CallExtensionAsync(this, 'run', node, []);
}

run(context, args, callback) {
return this._run(context, args, '').then(result => {
callback(null, result);
}, callback);
}
}

class NunjucksAsyncBlock extends NunjucksBlock {
parse(parser, nodes, lexer) {
const node = this._parseArgs(parser, nodes, lexer);
const body = this._parseBody(parser, nodes, lexer);

return new nodes.CallExtensionAsync(this, 'run', node, [body]);
}

run(context, args, body, callback) {

body((err, result) => {


body = () => result || '';

this._run(context, args, trimBody(body)).then(result => {
callback(err, result);
});
});
}
}

const getContextLineNums = (min, max, center, amplitude) => {
const result = [];
let lbound = Math.max(min, center - amplitude);
const hbound = Math.min(max, center + amplitude);
while (lbound <= hbound) result.push(lbound++);
return result;
};

const LINES_OF_CONTEXT = 5;

const getContext = (lines, errLine, location, type) => {
const message = [
location + ' ' + type,
cyan('    =====               Context Dump               ====='),
cyan('    === (line number probably different from source) ===')
];

Array.prototype.push.apply(message,

getContextLineNums(1, lines.length, errLine, LINES_OF_CONTEXT)
.map(lnNum => {
const line = '  ' + lnNum + ' | ' + lines[lnNum - 1];
if (lnNum === errLine) {
return cyan.bold(line);
}

return cyan(line);
})
);
message.push(cyan(
'    =====             Context Dump Ends            ====='));

return message;
};


const formatNunjucksError = (err, input) => {
const match = err.message.match(/Line (\d+), Column \d+/);
if (!match) return err;
const errLine = parseInt(match[1], 10);
if (isNaN(errLine)) return err;


const splited = err.message.replace('(unknown path)', '').split('\n');

const e = new Error();
e.name = 'Nunjucks Error';
e.line = errLine;
e.location = splited[0];
e.type = splited[1].trim();
e.message = getContext(input.split(/\r?\n/), errLine, e.location, e.type).join('\n');
return e;
};

class Tag {
constructor() {
this.env = new nunjucks.Environment(null, {
autoescape: false
});
}

register(name, fn, options) {
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
}

unregister(name) {
if (!name) throw new TypeError('name is required');

const { env } = this;

if (env.hasExtension(name)) env.removeExtension(name);
}

render(str, options, callback) {
if (!callback && typeof options === 'function') {
callback = options;
options = {};
}

const cache = [];

const escapeContent = str => `<!--${placeholder}${cache.push(str) - 1}-->`;

str = str.replace(/<pre><code.*>[\s\S]*?<\/code><\/pre>/gm, escapeContent);

return Promise.fromCallback(cb => { this.env.renderString(str, options, cb); })
.catch(err => Promise.reject(formatNunjucksError(err, str)))
.then(result => result.replace(rPlaceholder, (_, index) => cache[index]))
.asCallback(callback);
}
}

