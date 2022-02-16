'use strict';

var should = require('chai').should();

describe('Deployer', function() {
var Deployer = require('../../../lib/extend/deployer');

it('register()', function() {
var d = new Deployer();


d.register('test', function() {});

d.get('test').should.exist;


try {
d.register();
} catch (err) {
err.should.be
