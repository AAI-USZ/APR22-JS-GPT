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


try {
f.register();
} catch (err) {
err.should.be
.instanceOf(TypeError)
.property('message', 'fn must be a function');
}
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
filter.called.should.eql(false);
});

it('unregister() - type is required', () => {
const f = new Filter();
const errorCallback = spy(err => {
err.should.have.property('message', 'type is required');
