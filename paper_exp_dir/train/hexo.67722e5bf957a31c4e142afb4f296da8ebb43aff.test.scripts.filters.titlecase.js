var should = require('chai').should();

describe('Titlecase', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var titlecase = require('../../../lib/plugins/filter/before_post_render/titlecase').bind(hexo);

it('disabled', () => {
var title = 'Today is a good day';
var data = {title};
hexo.config.titlecase = false;
