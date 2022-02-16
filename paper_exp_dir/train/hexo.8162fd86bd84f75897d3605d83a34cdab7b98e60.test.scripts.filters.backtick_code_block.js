var should = require('chai').should();
var util = require('hexo-util');
var _ = require('lodash');
var defaultConfig = require('../../../lib/hexo/default_config');

describe('Backtick code block', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var codeBlock = require('../../../lib/plugins/filter/before_post_render/backtick_code_block').bind(hexo);

var code = [
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

hexo.config.highlight = _.cloneDeep(defaultConfig.highlight);
});

it('disabled', () => {
var content = [
'``` js',
code,
'```'
].join('\n');

var data = {content};

hexo.config.highlight.enable = false;
codeBlock(data);
data.content.should.eql(content);
});

it('with no config (disabled)', () => {
var content = [
'``` js',
code,
'```'
].join('\n');

var data = {content};

var oldConfig = hexo.config.highlight;
delete hexo.config.highlight;

codeBlock(data);
data.content.should.eql(content);

hexo.config.highlight = oldConfig;
});

it('default', () => {
var data = {
content: [
'``` js',
code,
'```'
].join('\n')
};

codeBlock(data);
data.content.should.eql('<escape>' + highlight(code, {lang: 'js'}) + '</escape>');
});

it('without language name', () => {
var data = {
content: [
'```',
code,
'```'
].join('\n')
};

var expected = highlight(code);

codeBlock(data);
data.content.should.eql('<escape>' + expected + '</escape>');
});

it('without language name - ignore tab character', () => {
var data = {
content: [
'``` \t',
code,
'```'
].join('\n')
};

var expected = highlight(code);

codeBlock(data);
data.content.should.eql('<escape>' + expected + '</escape>');
});

it('title', () => {
var data = {
content: [
'``` js Hello world',
code,
'```'
].join('\n')
};

var expected = highlight(code, {
lang: 'js',
caption: '<span>Hello world</span>'
});

codeBlock(data);
data.content.should.eql('<escape>' + expected + '</escape>');
});

it('url', () => {
var data = {
content: [
'``` js Hello world http://hexo.io/',
code,
'```'
].join('\n')
};

var expected = highlight(code, {
lang: 'js',
caption: '<span>Hello world</span><a href="http://hexo.io/">link</a>'
});

codeBlock(data);
data.content.should.eql('<escape>' + expected + '</escape>');
});

it('link text', () => {
var data = {
content: [
'``` js Hello world http://hexo.io/ Hexo',
code,
'```'
].join('\n')
};

var expected = highlight(code, {
lang: 'js',
caption: '<span>Hello world</span><a href="http://hexo.io/">Hexo</a>'
});

codeBlock(data);
data.content.should.eql('<escape>' + expected + '</escape>');
});

it('indent', () => {
var indentCode = code.split('\n').map(line => '  ' + line).join('\n');

var data = {
content: [
'``` js Hello world http://hexo.io/',
indentCode,
'```'
].join('\n')
};

var expected = highlight(code, {
lang: 'js',
caption: '<span>Hello world</span><a href="http://hexo.io/">link</a>'
});

codeBlock(data);
data.content.should.eql('<escape>' + expected + '</escape>');
});

it('line number false', () => {
hexo.config.highlight.line_number = false;

var data = {
content: [
'``` js',
code,
'```'
].join('\n')
};

var expected = highlight(code, {
lang: 'js',
gutter: false
});

codeBlock(data);
data.content.should.eql('<escape>' + expected + '</escape>');
});

it('line number false, don`t first_line_number always1', () => {
hexo.config.highlight.line_number = false;
hexo.config.highlight.first_line_number = 'always1';

var data = {
content: [
'``` js',
code,
'```'
