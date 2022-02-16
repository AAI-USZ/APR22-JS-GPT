'use strict';

const should = require('chai').should();
const moment = require('moment');

describe('common', () => {
const common = require('../../../lib/plugins/processor/common');

it('isTmpFile()', () => {
common.isTmpFile('foo').should.be.false;
