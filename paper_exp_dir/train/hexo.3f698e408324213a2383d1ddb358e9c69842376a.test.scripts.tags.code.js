var should = require('chai').should();
var highlight = require('hexo-util').highlight;

describe('code', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var codeTag = require('../../../lib/plugins/tag/code')(hexo);

var fixture = [
'if (tired && night){',
