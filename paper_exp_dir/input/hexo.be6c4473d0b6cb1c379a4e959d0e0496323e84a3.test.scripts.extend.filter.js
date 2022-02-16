'use strict';

const { spy } = require('sinon');

describe('Filter', () => {
const Filter = require('../../../lib/extend/filter');

it('register()', () => {
const f = new Filter();


f.register('test', () => {});

f.list('test')[0].should.exist;
f.list('test')[0].priority.should.eql(10);


f.register('test2', () => {}, 50);

f.list('test2')[0].priority.should.eql(50);


f.register(() => {});

f.list('after_post_render')[0].should.exist;
f.list('after_post_render')[0].priority.should.eql(10);


f.register(() => {}, 50);

f.list('after_post_render')[1].priority.should.eql(50);


should.throw(() => f.register(), TypeError, 'fn must be a function');
});

it('register() - type alias', () => {
const f = new Filter();


f.register('pre', () => {});

f.list('before_post_render')[0].should.exist;


f.register('post', () => {});

f.list('after_post_render')[0].should.exist;
});

it('register() - priority', () => {
const f = new Filter();

f.register('test', () => {});

f.register('test', () => {}, 5);

f.register('test', () => {}, 15);

f.list('test').map(item => item.priority).should.eql([5, 10, 15]);
});

it('unregister()', async () => {
const f = new Filter();
const filter = spy();

f.register('test', filter);
f.unregister('test', filter);

await f.exec('test');
filter.called.should.be.false;
});

it('unregister() - type is required', () => {
const f = new Filter();
should.throw(() => f.unregister(), 'type is required');
});

it('unregister() - fn must be a function', () => {
const f = new Filter();
should.throw(() => f.unregister('test'), 'fn must be a function');
});

it('list()', () => {
const f = new Filter();

f.register('test', () => {});

f.list().test.should.exist;
f.list('test')[0].should.exist;
f.list('foo').should.have.lengthOf(0);
});

it('exec()', async () => {
const f = new Filter();

const filter1 = spy(data => {
data.should.eql('');
return data + 'foo';
});

const filter2 = spy(data => {
