'use strict';

var should = require('chai').should();

describe('Renderer', function() {
var Renderer = require('../../../lib/extend/renderer');

it('register()', function() {
var r = new Renderer();


r.register('yaml', 'json', function() {});

r.get('yaml').should.exist;
r.get('yaml').output.should.eql('json');


r.register('yaml', 'json', function() {}, true);

r.get('yaml').should.exist;
r.get('yaml').output.should.eql('json');
r.get('yaml', true).should.exist;
r.get('yaml', true).output.should.eql('json');


try {
r.register('yaml', 'json');
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'fn must be a function');
}


try {
r.register('yaml');
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'output is required');
}


try {
r.register();
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'name is required');
}
});

it('register() - promisify', function() {
var r = new Renderer();


r.register('yaml', 'json', function(data, options, callback) {
callback(null, 'foo');
});

r.get('yaml')({}, {}).then(function(result) {
result.should.eql('foo');
});


r.register('swig', 'html', function(data, options) {
return 'foo';
}, true);

r.get('swig')({}, {}).then(function(result) {
result.should.eql('foo');
});
});

it('register() - compile', function() {
var r = new Renderer();

function renderer(data, locals) {}

renderer.compile = function(data) {

};

r.register('swig', 'html', renderer);
r.get('swig').compile.should.eql(renderer.compile);
});

