var should = require('chai').should();

describe('Migrator', function(){
var Migrator = require('../../../lib/extend/migrator');

it('register()', function(){
var d = new Migrator();


d.register('test', function(){});
d.get('test').should.exist;


try {
d.register();
} catch (err){
err.should.be
.instanceOf(TypeError)
.property('message', 'name is required');
}


try {
d.register('test');
} catch (err){
err.should.be
.instanceOf(TypeError)
.property('message', 'fn must be a function');
}
});

it('register() - promisify', function(){
var d = new Migrator();

d.register('test', function(args, callback){
args.should.eql({foo: 'bar'});
callback(null, 'foo');
});

d.get('test')({
foo: 'bar'
}).then(function(result){
result.should.eql('foo');
});
});

it('register() - Promise.method', function(){
var d = new Migrator();

d.register('test', function(args){
args.should.eql({foo: 'bar'});
return 'foo';
});

d.get('test')({
foo: 'bar'
}).then(function(result){
result.should.eql('foo');
