'use strict';

const sinon = require('sinon');

describe('migrate', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname, {silent: true});
const migrate = require('../../../lib/plugins/console/migrate').bind(hexo);

it('default', () => {
const migrator = sinon.spy(args => {
args.foo.should.eql(1);
