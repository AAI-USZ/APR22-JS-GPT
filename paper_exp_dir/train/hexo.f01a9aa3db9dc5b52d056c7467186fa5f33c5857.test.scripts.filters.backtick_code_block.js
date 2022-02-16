'use strict';

var should = require('chai').should();
var util = require('hexo-util');
var _ = require('lodash');
var defaultConfig = require('../../../lib/hexo/default_config');

describe('Backtick code block', function() {
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

beforeEach(function() {

hexo.config.highlight = _.clone(defaultConfig.highlight);
});

it('disabled', function() {
var content = [
'``` js',
code,
'```'
].join('\n');

var data = {content: content};

hexo.config.highlight.enable = false;
codeBlock(data);
data.content.should.eql(content);
});

it('with no config (disabled)', function() {
var content = [
'``` js',
code,
'```'
].join('\n');

var data = {content: content};

var oldConfig = hexo.config.highlight;
delete hexo.config.highlight;

codeBlock(data);
data.content.should.eql(content);

hexo.config.highlight = oldConfig;
});

it('default', function() {
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

it('without language name', function() {
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

it('without language name - ignore tab character', function() {
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

it('title', function() {
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

it('url', function() {
