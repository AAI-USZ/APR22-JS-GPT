'use strict';

var moment = require('moment');
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
tags: [
{ name: 'optimize' },
{ name: 'web' }
]
},
config: hexo.config,
is_post: isPost
});

result.should.eql([
meta({name: 'keywords', content: 'optimize,web'}),
meta({property: 'og:type', content: 'website'}),
meta({property: 'og:title', content: hexo.config.title}),
meta({property: 'og:url'}),
meta({property: 'og:site_name', content: hexo.config.title}),
meta({name: 'twitter:card', content: 'summary'}),
meta({name: 'twitter:title', content: hexo.config.title})
].join('\n'));
});

