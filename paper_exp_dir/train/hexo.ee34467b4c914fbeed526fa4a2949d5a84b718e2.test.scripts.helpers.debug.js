'use strict';

const sinon = require('sinon');

describe('debug', () => {
const debug = require('../../../lib/plugins/helper/debug');
const { inspect } = require('util');

it('inspect simple object', () => {
const obj = { foo: 'bar' };
debug.inspectObject(obj).should.eql(inspect(obj));
});
