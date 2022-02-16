var should = require('chai').should();
var pathFn = require('path');

describe('Page', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Page = hexo.model('Page');

it('default values', function(){
var now = Date.now();

return Page.insert({
source: 'foo',
path: 'bar'
}).then(function(data){
data.title.should.eql('');
data.date.valueOf().should.gte(now);
data.updated.valueOf().should.gte(now);
data.comments.should.be.true;
data.layout.should.eql('page');
data.content.should.eql('');
data.excerpt.should.eql('');
data.more.should.eql('');
data.raw.should.eql('');

return Page.removeById(data._id);
});
});

it('source - required', function(){
return Page.insert({}).catch(function(err){
err.should.have.property('message', '`source` is required!');
});
});
