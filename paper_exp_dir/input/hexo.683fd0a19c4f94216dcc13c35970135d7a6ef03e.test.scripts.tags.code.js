'use strict';

var should = require('chai').should();

describe('code', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var codeTag = require('../../../lib/plugins/tag/code')(hexo);

var fixture = [
'if (tired && night){',
'  sleep();',
'}'
].join('\n');

function code(args, content){
return codeTag(args.split(' '), content);
}

