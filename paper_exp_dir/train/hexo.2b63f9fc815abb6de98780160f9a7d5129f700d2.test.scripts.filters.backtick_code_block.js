'use strict';

const util = require('hexo-util');
const defaultConfig = require('../../../lib/hexo/default_config');

describe('Backtick code block', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const codeBlock = require('../../../lib/plugins/filter/before_post_render/backtick_code_block').bind(hexo);

const code = [
'if (tired && night){',
'  sleep();',
'}'
].join('\n');

function highlight(code, options) {
return util.highlight(code, options || {})
.replace(/{/g, '&#123;')
.replace(/}/g, '&#125;');
}

beforeEach(() => {

hexo.config.highlight = Object.assign({}, defaultConfig.highlight);
});

it('disabled', () => {
const content = [
'``` js',
code,
'```'
].join('\n');

const data = {content};

hexo.config.highlight.enable = false;
codeBlock(data);
data.content.should.eql(content);
});

it('with no config (disabled)', () => {
const content = [
'``` js',
code,
'```'
].join('\n');

const data = {content};

const oldConfig = hexo.config.highlight;
delete hexo.config.highlight;

codeBlock(data);
data.content.should.eql(content);

hexo.config.highlight = oldConfig;
});

it('default', () => {
const data = {
content: [
'``` js',
code,
'```'
].join('\n')
};

codeBlock(data);
data.content.should.eql('<!--hexoPostRenderEscape:' + highlight(code, {lang: 'js'}) + ':hexoPostRenderEscape-->');
});

it('without language name', () => {
const data = {
content: [
'```',
code,
'```'
].join('\n')
};

const expected = highlight(code);

codeBlock(data);
data.content.should.eql('<!--hexoPostRenderEscape:' + expected + ':hexoPostRenderEscape-->');
});

it('without language name - ignore tab character', () => {
const data = {
content: [
'``` \t',
code,
'```'
].join('\n')
};

const expected = highlight(code);

codeBlock(data);
data.content.should.eql('<!--hexoPostRenderEscape:' + expected + ':hexoPostRenderEscape-->');
});

it('title', () => {
const data = {
content: [
'``` js Hello world',
code,
'```'
].join('\n')
};

const expected = highlight(code, {
lang: 'js',
caption: '<span>Hello world</span>'
});

codeBlock(data);
data.content.should.eql('<!--hexoPostRenderEscape:' + expected + ':hexoPostRenderEscape-->');
});

it('url', () => {
const data = {
content: [
'``` js Hello world https://hexo.io/',
code,
'```'
].join('\n')
};

const expected = highlight(code, {
lang: 'js',
caption: '<span>Hello world</span><a href="https://hexo.io/">link</a>'
});

codeBlock(data);
data.content.should.eql('<!--hexoPostRenderEscape:' + expected + ':hexoPostRenderEscape-->');
});

it('link text', () => {
const data = {
content: [
'``` js Hello world https://hexo.io/ Hexo',
code,
'```'
].join('\n')
};

const expected = highlight(code, {
lang: 'js',
caption: '<span>Hello world</span><a href="https://hexo.io/">Hexo</a>'
});

codeBlock(data);
data.content.should.eql('<!--hexoPostRenderEscape:' + expected + ':hexoPostRenderEscape-->');
});

it('indent', () => {
const indentCode = code.split('\n').map(line => '  ' + line).join('\n');

const data = {
content: [
'``` js Hello world https://hexo.io/',
indentCode,
'```'
].join('\n')
};

const expected = highlight(code, {
lang: 'js',
caption: '<span>Hello world</span><a href="https://hexo.io/">link</a>'
});

codeBlock(data);
data.content.should.eql('<!--hexoPostRenderEscape:' + expected + ':hexoPostRenderEscape-->');
});

it('line number false', () => {
hexo.config.highlight.line_number = false;

const data = {
content: [
'``` js',
code,
'```'
].join('\n')
};

const expected = highlight(code, {
lang: 'js',
gutter: false
});

codeBlock(data);
data.content.should.eql('<!--hexoPostRenderEscape:' + expected + ':hexoPostRenderEscape-->');
});

it('line number false, don`t first_line_number always1', () => {
hexo.config.highlight.line_number = false;
hexo.config.highlight.first_line_number = 'always1';

const data = {
content: [
'``` js',
code,
'```'
].join('\n')
};

const expected = highlight(code, {
lang: 'js',
gutter: false
});

codeBlock(data);
data.content.should.eql('<!--hexoPostRenderEscape:' + expected + ':hexoPostRenderEscape-->');
});

it('line number false, don`t care first_line_number inilne', () => {
hexo.config.highlight.line_number = false;
hexo.config.highlight.first_line_number = 'inilne';

const data = {
content: [
'``` js',
code,
'```'
].join('\n')
};

const expected = highlight(code, {
lang: 'js',
gutter: false
});

codeBlock(data);
data.content.should.eql('<!--hexoPostRenderEscape:' + expected + ':hexoPostRenderEscape-->');
