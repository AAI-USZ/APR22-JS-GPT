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

beforeEach(() => {

hexo.config.highlight = Object.assign({}, defaultConfig.highlight);
hexo.config.prismjs = Object.assign({}, defaultConfig.prismjs);
});

after(() => {

hexo.config.highlight = defaultConfig.highlight;
hexo.config.prismjs = defaultConfig.prismjs;
});

describe('highlightjs', () => {
it('disabled', () => {
