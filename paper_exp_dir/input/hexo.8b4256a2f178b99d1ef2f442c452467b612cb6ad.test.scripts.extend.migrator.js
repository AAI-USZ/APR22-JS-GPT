'use strict';

describe('Migrator', () => {
const Migrator = require('../../../lib/extend/migrator');

it('register()', () => {
const d = new Migrator();


d.register('test', () => {});

d.get('test').should.exist;


try {
d.register();
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'name is required');
}


try {
d.register('test');
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'fn must be a function');
}
});

it('register() - promisify', () => {
const d = new Migrator();

d.register('test', (args, callback) => {
args.should.eql({foo: 'bar'});
callback(null, 'foo');
});

d.get('test')({
foo: 'bar'
}).then(result => {
result.should.eql('foo');
});
});

const d = new Migrator();

d.register('test', args => {
args.should.eql({foo: 'bar'});
return 'foo';
});

foo: 'bar'
