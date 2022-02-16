'use strict';

describe('Migrator', () => {
const Migrator = require('../../../lib/extend/migrator');

it('register()', () => {
const d = new Migrator();


d.register('test', () => {});

d.get('test').should.exist;


should.throw(() => d.register(), TypeError, 'name is required');


should.throw(() => d.register('test'), TypeError, 'fn must be a function');
});

it('register() - promisify', () => {
const d = new Migrator();

d.register('test', (args, callback) => {
args.should.eql({foo: 'bar'});
