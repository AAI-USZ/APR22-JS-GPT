'use strict';

var should = require('chai').should();

describe('Migrator', function() {
var Migrator = require('../../../lib/extend/migrator');

it('register()', function() {
var d = new Migrator();


d.register('test', function() {});

d.get('test').should.exist;


try {
d.register();
} catch (err) {
err.should.be
