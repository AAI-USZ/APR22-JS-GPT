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
].join('\n') + '\n');
});

it('title - page', function(){
var ctx = {
page: {title: 'Hello world'},
config: hexo.config,
is_post: isPost
};

var result = openGraph.call(ctx);

result.should.eql([
meta({name: 'description'}),
meta({property: 'og:type', content: 'website'}),
meta({property: 'og:title', content: ctx.page.title}),
meta({property: 'og:url'}),
meta({property: 'og:site_name', content: hexo.config.title}),
meta({property: 'og:description'}),
meta({name: 'twitter:card', content: 'summary'}),
meta({name: 'twitter:title', content: ctx.page.title}),
meta({name: 'twitter:description'})
].join('\n') + '\n');
});

it('title - options', function(){
var result = openGraph.call({
page: {title: 'Hello world'},
config: hexo.config,
is_post: isPost
}, {title: 'test'});

result.should.eql([
meta({name: 'description'}),
meta({property: 'og:type', content: 'website'}),
meta({property: 'og:title', content: 'test'}),
meta({property: 'og:url'}),
meta({property: 'og:site_name', content: hexo.config.title}),
meta({property: 'og:description'}),
meta({name: 'twitter:card', content: 'summary'}),
meta({name: 'twitter:title', content: 'test'}),
meta({name: 'twitter:description'})
].join('\n') + '\n');
});

it('type - options', function(){
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost
}, {type: 'photo'});

result.should.eql([
meta({name: 'description'}),
meta({property: 'og:type', content: 'photo'}),
meta({property: 'og:title', content: hexo.config.title}),
meta({property: 'og:url'}),
meta({property: 'og:site_name', content: hexo.config.title}),
meta({property: 'og:description'}),
meta({name: 'twitter:card', content: 'summary'}),
meta({name: 'twitter:title', content: hexo.config.title}),
meta({name: 'twitter:description'})
].join('\n') + '\n');
});

it('type - is_post', function(){
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: function(){ return true; }
});

result.should.eql([
meta({name: 'description'}),
meta({property: 'og:type', content: 'article'}),
meta({property: 'og:title', content: hexo.config.title}),
meta({property: 'og:url'}),
meta({property: 'og:site_name', content: hexo.config.title}),
meta({property: 'og:description'}),
meta({name: 'twitter:card', content: 'summary'}),
meta({name: 'twitter:title', content: hexo.config.title}),
meta({name: 'twitter:description'})
].join('\n') + '\n');
});

it('url - context', function(){
var ctx = {
page: {},
config: hexo.config,
is_post: isPost,
url: 'http://hexo.io/foo'
};

var result = openGraph.call(ctx);

result.should.eql([
meta({name: 'description'}),
meta({property: 'og:type', content: 'website'}),
meta({property: 'og:title', content: hexo.config.title}),
meta({property: 'og:url', content: ctx.url}),
meta({property: 'og:site_name', content: hexo.config.title}),
meta({property: 'og:description'}),
meta({name: 'twitter:card', content: 'summary'}),
meta({name: 'twitter:title', content: hexo.config.title}),
meta({name: 'twitter:description'})
].join('\n') + '\n');
});

it('url - options', function(){
var result = openGraph.call({
page: {},
config: hexo.config,
is_post: isPost,
url: 'http://hexo.io/foo'
}, {url: 'http://hexo.io/bar'});

result.should.eql([
meta({name: 'description'}),
meta({property: 'og:type', content: 'website'}),
meta({property: 'og:title', content: hexo.config.title}),
meta({property: 'og:url', content: 'http://hexo.io/bar'}),
meta({property: 'og:site_name', content: hexo.config.title}),
meta({property: 'og:description'}),
meta({name: 'twitter:card', content: 'summary'}),
meta({name: 'twitter:title', content: hexo.config.title}),
meta({name: 'twitter:description'})
].join('\n') + '\n');
});

it('images - content', function(){
var result = openGraph.call({
page: {
content: [
'<p>123456789</p>',
'<img src="http://hexo.io/test.jpg">'
].join('')
},
config: hexo.config,
is_post: isPost
