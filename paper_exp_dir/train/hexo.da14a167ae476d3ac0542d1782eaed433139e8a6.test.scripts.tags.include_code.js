'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const highlight = require('hexo-util').highlight;
const Promise = require('bluebird');

describe('include_code', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'include_code_test'));
const includeCode = Promise.method(require('../../../lib/plugins/tag/include_code')(hexo));
const path = pathFn.join(hexo.source_dir, hexo.config.code_dir, 'test.js');

const fixture = [
'if (tired && night){',
'  sleep();',
'}'
].join('\n');

function code(args) {
return includeCode(args.split(' '));
}

before(() => fs.writeFile(path, fixture));

after(() => fs.rmdir(hexo.base_dir));

it('default', () => {
const expected = highlight(fixture, {
lang: 'js',
caption: '<span>test.js</span><a href="/downloads/code/test.js">view raw</a>'
});

return code('test.js').then(result => {
result.should.eql(expected);
});
});

it('title', () => {
const expected = highlight(fixture, {
lang: 'js',
caption: '<span>Hello world</span><a href="/downloads/code/test.js">view raw</a>'
});

return code('Hello world test.js').then(result => {
result.should.eql(expected);
});
});

it('lang', () => {
const expected = highlight(fixture, {
lang: 'js',
caption: '<span>Hello world</span><a href="/downloads/code/test.js">view raw</a>'
});

return code('Hello world lang:js test.js').then(result => {
result.should.eql(expected);
});
});

it('from', () => {
const fixture = [
'}'
].join('\n');
const expected = highlight(fixture, {
lang: 'js',
caption: '<span>Hello world</span><a href="/downloads/code/test.js">view raw</a>'
});

return code('Hello world lang:js from:3 test.js').then(result => {
