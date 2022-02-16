'use strict';

const sinon = require('sinon');

describe('Locals', () => {
const Locals = require('../../../lib/hexo/locals');
const locals = new Locals();

it('get() - name must be a string', () => {
const errorCallback = sinon.spy(err => {
err.should.have.property('message', 'name must be a string!');
});
