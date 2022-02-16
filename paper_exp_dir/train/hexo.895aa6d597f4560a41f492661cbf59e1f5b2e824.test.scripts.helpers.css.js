var should = require('chai').should();

describe('css', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);

var ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var css = require('../../../lib/plugins/helper/css').bind(ctx);

function assertResult(result){
