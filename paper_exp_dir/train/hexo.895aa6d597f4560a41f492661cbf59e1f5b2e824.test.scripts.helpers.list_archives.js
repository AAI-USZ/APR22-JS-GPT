var should = require('chai').should();

describe('list_archives', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');

var ctx = {
site: hexo.locals,
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

var listArchives = require('../../../lib/plugins/helper/list_archives').bind(ctx);

