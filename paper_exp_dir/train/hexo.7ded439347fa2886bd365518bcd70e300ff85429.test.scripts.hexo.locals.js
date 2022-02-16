'use strict';

const should = require('chai').should();
const sinon = require('sinon');

describe('Locals', () => {
const Locals = require('../../../lib/hexo/locals');
const locals = new Locals();

it('get() - name must be a string', () => {
