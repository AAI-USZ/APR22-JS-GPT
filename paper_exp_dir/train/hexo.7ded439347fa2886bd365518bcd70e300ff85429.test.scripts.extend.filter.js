'use strict';

require('chai').should();
const sinon = require('sinon');

describe('Filter', () => {
const Filter = require('../../../lib/extend/filter');

it('register()', () => {
const f = new Filter();
