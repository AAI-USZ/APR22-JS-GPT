var should = require('chai').should();
var qs = require('querystring');

describe('mail_to', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var mailto = require('../../../lib/plugins/helper/mail_to').bind(ctx);

it('path', function(){
