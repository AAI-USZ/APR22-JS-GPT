var should = require('chai').should();

describe('Migrator', () => {
var Migrator = require('../../../lib/extend/migrator');

it('register()', () => {
var d = new Migrator();


d.register('test', () => {});

d.get('test').should.exist;
