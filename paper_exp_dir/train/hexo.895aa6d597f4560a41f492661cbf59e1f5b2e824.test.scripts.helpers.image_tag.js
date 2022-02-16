var should = require('chai').should();

describe('image_tag', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var img = require('../../../lib/plugins/helper/image_tag').bind(ctx);

it('path', function(){
