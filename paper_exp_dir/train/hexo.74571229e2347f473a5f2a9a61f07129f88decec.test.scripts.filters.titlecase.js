'use strict';

var should = require('chai').should();

describe('Titlecase', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var titlecase = require('../../../lib/plugins/filter/before_post_render/titlecase').bind(hexo);

it('disabled', function(){
var title = 'Today is a good day';
