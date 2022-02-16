'use strict';

var should = require('chai').should();

describe('open_graph', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var openGraph = require('../../../lib/plugins/helper/open_graph');
var isPost = require('../../../lib/plugins/helper/is').post;
var tag = require('hexo-util').htmlTag;

function meta(options) {
return tag('meta', options);
}

it('default', function() {
var result = openGraph.call({
page: {
tags: [{
name: 'optimize'
}, {
name: 'web'
}]
},
config: hexo.config,
is_post: isPost
});
