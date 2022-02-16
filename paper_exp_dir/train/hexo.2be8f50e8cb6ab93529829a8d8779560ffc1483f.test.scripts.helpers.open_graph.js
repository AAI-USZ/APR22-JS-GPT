'use strict';

var moment = require('moment');
var should = require('chai').should();

describe('open_graph', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var openGraph = require('../../../lib/plugins/helper/open_graph');
var isPost = require('../../../lib/plugins/helper/is').post;
var tag = require('hexo-util').htmlTag;
var Post = hexo.model('Post');

function meta(options) {
return tag('meta', options);
}

before(function() {
hexo.config.permalink = ':title';
return hexo.init();
});
