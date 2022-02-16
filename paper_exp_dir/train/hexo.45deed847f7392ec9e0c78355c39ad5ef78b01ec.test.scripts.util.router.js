var should = require('chai').should();

describe('Router', function(){
var Router = require('../../../lib/util/router');
var router = new Router();

it('format()', function(){
router.format('foo').should.eql('foo');


router.format('/foo').should.eql('foo');
router.format('///foo').should.eql('foo');


router.format('foo/').should.eql('foo/index.html');


router.format('').should.eql('index.html');
router.format().should.eql('index.html');


router.format('foo\\bar').should.eql('foo/bar');
router.format('foo\\bar\\').should.eql('foo/bar/index.html');


router.format('foo?a=1&b=2').should.eql('foo');
});

it('set() - string', function(){
router.once('update', function(source, route){
source.should.eql('foo');

route(function(err, content){
should.not.exist(err);
content.should.eql('bar');
});
});

router.set('foo', 'bar');
router.get('foo', function(err, content){
should.not.exist(err);
content.should.eql('bar');
});
});

it('set() - function', function(){
router.once('update', function(source, route){
source.should.eql('hello');

route(function(err, content){
should.not.exist(err);
content.should.eql('world');
});
});

router.set('hello', function(fn){
fn(null, 'world');
});

router.get('hello', function(err, content){
should.not.exist(err);
content.should.eql('world');
});
});

it('remove()', function(){
router.once('remove', function(source){
source.should.eql('foo');
});
