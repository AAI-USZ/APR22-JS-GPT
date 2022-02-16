'use strict';

var pathFn = require('path');
var osFn = require('os');
var should = require('chai').should();
var fs = require('hexo-fs');
var yml = require('js-yaml');

describe('config flag handling', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'test_dir'));

var mcp = require('../../../lib/hexo/multi_config_path')(hexo);
var base = hexo.base_dir;

function ConsoleReader() {
this.reader = [];
this.d = function(...args) {
var type = 'debug';
var message = '';
for (var i = 0; i < args.length;) {
message += args[i];
if (++i < args.length) {
message += ' ';
}
}

this.reader.push({
type,
msg: message
});
}.bind(this);

this.i = function(...args) {
var type = 'info';
var message = '';
for (var i = 0; i < args.length;) {
message += args[i];
if (++i < args.length) {
message += ' ';
}
}

this.reader.push({
type,
msg: message
});
}.bind(this);

this.w = function(...args) {
var type = 'warning';
var message = '';
for (var i = 0; i < args.length;) {
message += args[i];
if (++i < args.length) {
message += ' ';
}
}

this.reader.push({
type,
msg: message
});
}.bind(this);

this.e = function(...args) {
var type = 'error';
var message = '';
for (var i = 0; i < args.length;) {
message += args[i];
if (++i < args.length) {
message += ' ';
}
}

this.reader.push({
type,
msg: message
});
}.bind(this);
}

hexo.log = new ConsoleReader();

var testYaml1 = [
'author: foo',
'type: dinosaur',
'favorites:',
'  food: sushi',
'  color: purple'
].join('\n');

var testYaml2 = [
'author: bar',
'favorites:',
'  food: candy',
'  ice_cream: chocolate'
].join('\n');

var testJson1 = [
'{',
'"author": "dinosaur",',
'"type": "elephant",',
'"favorites": {"food": "burgers"}',
'}'
].join('\n');

var testJson2 = [
'{',
'"author": "waldo",',
'"favorites": {',
'  "food": "ice cream",',
'  "ice_cream": "strawberry"',
'  }',
'}'
].join('\n');

var testJson3 = [
'{',
'"author": "james bond",',
'"favorites": {',
'  "food": "martini",',
'  "ice_cream": "vanilla"',
'  }',
'}'
].join('\n');

