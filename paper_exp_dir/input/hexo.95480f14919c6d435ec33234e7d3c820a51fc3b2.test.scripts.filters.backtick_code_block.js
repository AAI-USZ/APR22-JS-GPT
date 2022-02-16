'use strict';

var should = require('chai').should();
var util = require('hexo-util');
var _ = require('lodash');
var defaultConfig = require('../../../lib/hexo/default_config');

describe('Backtick code block', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var codeBlock = require('../../../lib/plugins/filter/before_post_render/backtick_code_block').bind(hexo);

var code = [
'if (tired && night){',
'  sleep();',
'}'
].join('\n');

function highlight(code, options){
return util.highlight(code, options || {})
.replace(/{/g, '&#123;')
.replace(/}/g, '&#125;');
}

beforeEach(function(){

hexo.config.highlight = _.clone(defaultConfig.highlight);
});

it('disabled', function(){
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

