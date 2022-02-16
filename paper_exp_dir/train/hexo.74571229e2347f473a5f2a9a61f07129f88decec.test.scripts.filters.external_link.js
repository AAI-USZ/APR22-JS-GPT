'use strict';

var should = require('chai').should();

describe('External link', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var externalLink = require('../../../lib/plugins/filter/after_post_render/external_link').bind(hexo);

hexo.config.external_link = true;
hexo.config.url = 'maji.moe';
