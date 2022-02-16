'use strict';

describe('Renderer', () => {
const Renderer = require('../../../lib/extend/renderer');

it('register()', () => {
const r = new Renderer();


r.register('yaml', 'json', () => {});

r.get('yaml').should.exist;
r.get('yaml').output.should.eql('json');


r.register('yaml', 'json', () => {}, true);

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

it('register() - promisify', async () => {
const r = new Renderer();


r.register('yaml', 'json', (data, options, callback) => {
callback(null, 'foo');
});

const yaml = await r.get('yaml')({}, {});
yaml.should.eql('foo');


r.register('swig', 'html', (data, options) => 'foo', true);

const swig = await r.get('swig')({}, {});
swig.should.eql('foo');
});

