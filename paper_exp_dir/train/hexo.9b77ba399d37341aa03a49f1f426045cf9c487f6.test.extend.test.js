var should = require('should'),
Extend = require('../lib/extend');

describe('Extend', function(){
var extend = new Extend();

describe('console', function(){
var Console = require('../lib/extend/console');

before(function(){
extend.module('console', Console);
extend.console.should.be.instanceof(Console);
});

it('register', function(){

extend.console.register('foo', 'foo desc', {}, function(){});
should.exist(extend.console.store.foo);
extend.console.store.foo.desc.should.eql('foo desc');
extend.console.store.foo.options.should.eql({});


extend.console.register('bar', 'bar desc', function(){});
should.exist(extend.console.store.bar);
extend.console.store.bar.desc.should.eql('bar desc');
extend.console.store.bar.options.should.eql({});


extend.console.register('abc', {}, function(){});
should.exist(extend.console.store.abc);
extend.console.store.abc.desc.should.eql('');
extend.console.store.abc.options.should.eql({});


extend.console.register('baz', function(){});
should.exist(extend.console.store.baz);
extend.console.store.baz.desc.should.eql('');
extend.console.store.baz.options.should.eql({});
});

it('register error', function(){

(function(){
extend.console.register('foo', 'foo desc', {});
}).should.throw('Console function is not defined');


(function(){
extend.console.register('foo', 'foo desc');
}).should.throw('Console function is not defined');


(function(){
extend.console.register('foo', {});
}).should.throw('Console function is not defined');
});

it('alias', function(){
extend.console.register('version', {alias: 'v'}, function(){});
extend.console.alias.v.should.eql(extend.console.store.version);
});

it('list', function(){
extend.console.list().should.eql(extend.console.store);
