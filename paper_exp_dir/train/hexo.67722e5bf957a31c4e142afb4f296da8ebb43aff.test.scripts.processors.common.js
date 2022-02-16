var should = require('chai').should();
var moment = require('moment');

describe('common', () => {
var common = require('../../../lib/plugins/processor/common');

it('isTmpFile()', () => {
common.isTmpFile('foo').should.be.false;
common.isTmpFile('foo%').should.be.true;
common.isTmpFile('foo~').should.be.true;
