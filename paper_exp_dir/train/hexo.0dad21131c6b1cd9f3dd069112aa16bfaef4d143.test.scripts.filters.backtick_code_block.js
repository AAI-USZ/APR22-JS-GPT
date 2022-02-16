'use strict';

const util = require('hexo-util');
const defaultConfig = require('../../../lib/hexo/default_config');

describe('Backtick code block', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const codeBlock = require('../../../lib/plugins/filter/before_post_render/backtick_code_block').bind(hexo);

const code = [
'if (tired && night) {',
'  sleep();',
'}'
].join('\n');

function highlight(code, options) {
return util.highlight(code, options || {})
.replace(/{/g, '&#123;')
.replace(/}/g, '&#125;');
}

function prism(code, options) {
return util.prismHighlight(code, options || {})
.replace(/{/g, '&#123;')
.replace(/}/g, '&#125;');
}


function enablePrismjs() {
hexo.config.highlight.enable = false;
hexo.config.prismjs.enable = true;
}

beforeEach(() => {

hexo.config.highlight = Object.assign({}, defaultConfig.highlight);
hexo.config.prismjs = Object.assign({}, defaultConfig.prismjs);
});

after(() => {

hexo.config.highlight = defaultConfig.highlight;
hexo.config.prismjs = defaultConfig.prismjs;
});

it('disabled', () => {
const content = [
'``` js',
code,
'```'
].join('\n');

const data = {content};

hexo.config.highlight.enable = false;
hexo.config.prismjs.enable = false;
codeBlock(data);
data.content.should.eql(content.replace(/{/g, '&#123;').replace(/}/g, '&#125;'));
});

it('with no config (disabled)', () => {
const content = [
'``` js',
code,
'```'
].join('\n');

const data = {content};

const oldHljsCfg = hexo.config.highlight;
const oldPrismCfg = hexo.config.prismjs;
delete hexo.config.highlight;
delete hexo.config.prismjs;

codeBlock(data);
data.content.should.eql(content.replace(/{/g, '&#123;').replace(/}/g, '&#125;'));

hexo.config.highlight = oldHljsCfg;
hexo.config.prismjs = oldPrismCfg;
});

it('shorthand', () => {
const data = {
content: 'Hello, world!'
};

should.not.exist(codeBlock(data));
});

it('highlightjs - default', () => {
const data = {
content: [
