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

