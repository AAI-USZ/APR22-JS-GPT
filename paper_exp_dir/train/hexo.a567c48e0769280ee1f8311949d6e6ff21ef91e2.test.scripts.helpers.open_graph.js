'use strict';

var should = require('chai').should();

describe('open_graph', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var openGraph = require('../../../lib/plugins/helper/open_graph');
var isPost = require('../../../lib/plugins/helper/is').post;
var tag = require('hexo-util').htmlTag;

function meta(options){
return tag('meta', options);
}

it('default', function(){
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost
});

result.should.eql([
meta({name: 'description'}),
meta({property: 'og:type', content: 'website'}),
meta({property: 'og:title', content: hexo.config.title}),
meta({property: 'og:url'}),
meta({property: 'og:site_name', content: hexo.config.title}),
meta({property: 'og:description'}),
meta({name: 'twitter:card', content: 'summary'}),
meta({name: 'twitter:title', content: hexo.config.title}),
meta({name: 'twitter:description'})
].join('\n'));
});

it('title - page', function(){
var ctx = {
page: {title: 'Hello world'},
config: hexo.config,
is_post: isPost
};

var result = openGraph.call(ctx);

result.should.contain(meta({property: 'og:title', content: ctx.page.title}));
});

it('title - options', function(){
var result = openGraph.call({
page: {title: 'Hello world'},
config: hexo.config,
is_post: isPost
}, {title: 'test'});

