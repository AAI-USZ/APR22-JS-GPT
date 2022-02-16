'use strict';

describe('Migrator', () => {
const Migrator = require('../../../lib/extend/migrator');

it('register()', () => {
const d = new Migrator();


d.register('test', () => {});

d.get('test').should.exist;


