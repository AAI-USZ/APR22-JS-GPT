'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const { highlight, prismHighlight } = require('hexo-util');
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

const code = args => includeCode(args.split(' '));

before(() => fs.writeFile(path, fixture));

after(() => fs.rmdir(hexo.base_dir));

describe('highlightjs', () => {
it('default', () => {
hexo.config.highlight.enable = true;
hexo.config.prismjs.enable = false;

const expected = highlight(fixture, {
lang: 'js',
caption: '<span>test.js</span><a href="/downloads/code/test.js">view raw</a>'
});

