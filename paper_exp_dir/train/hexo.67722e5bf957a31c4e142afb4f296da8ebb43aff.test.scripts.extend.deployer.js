var should = require('chai').should();

describe('Deployer', () => {
var Deployer = require('../../../lib/extend/deployer');

it('register()', () => {
var d = new Deployer();


d.register('test', () => {});

d.get('test').should.exist;
