'use strict';

require('chai').should();

describe('Deployer', () => {
const Deployer = require('../../../lib/extend/deployer');

it('register()', () => {
const d = new Deployer();


d.register('test', () => {});
