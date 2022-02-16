'use strict';

var should = require('chai').should();
var sinon = require('sinon');

describe('Filter', function(){
var Filter = require('../../../lib/extend/filter');

it('register()', function(){
var f = new Filter();


f.register('test', function(){});
f.list('test')[0].should.exist;
f.list('test')[0].priority.should.eql(10);


f.register('test2', function(){}, 50);
f.list('test2')[0].priority.should.eql(50);


f.register(function(){});
f.list('after_post_render')[0].should.exist;
f.list('after_post_render')[0].priority.should.eql(10);


f.register(function(){}, 50);
f.list('after_post_render')[1].priority.should.eql(50);


try {
f.register();
} catch (err){
err.should.be
.instanceOf(TypeError)
.property('message', 'fn must be a function');
}
});

it('register() - type alias', function(){
var f = new Filter();


f.register('pre', function(){});
f.list('before_post_render')[0].should.exist;


f.register('post', function(){});
f.list('after_post_render')[0].should.exist;
});

it('register() - priority', function(){
var f = new Filter();

f.register('test', function(){});
f.register('test', function(){}, 5);
f.register('test', function(){}, 15);

f.list('test').map(function(item){
return item.priority;
}).should.eql([5, 10, 15]);
});

it('unregister()', function(){
var f = new Filter();
var filter = sinon.spy();

f.register('test', filter);
f.unregister('test', filter);

return f.exec('test').then(function(){
filter.called.should.be.false;
});
});

it('unregister() - type is required', function(){
var f = new Filter();
var errorCallback = sinon.spy(function(err) {
err.should.have.property('message', 'type is required');
});

try {
f.unregister();
} catch (err){
errorCallback(err);
}

