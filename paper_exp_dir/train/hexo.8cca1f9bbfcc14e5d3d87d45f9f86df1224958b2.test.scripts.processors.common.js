'use strict';

var should = require('chai').should();
var moment = require('moment');

describe('common', function() {
var common = require('../../../lib/plugins/processor/common');

it('isTmpFile()', function() {
common.isTmpFile('foo').should.be.false;
common.isTmpFile('foo%').should.be.true;
common.isTmpFile('foo~').should.be.true;
});

it('isHiddenFile()', function() {
common.isHiddenFile('foo').should.be.false;
common.isHiddenFile('_foo').should.be.true;
common.isHiddenFile('foo/_bar').should.be.true;
common.isHiddenFile('.foo').should.be.true;
common.isHiddenFile('foo/.bar').should.be.true;
});

it('ignoreTmpAndHiddenFile()', function() {
var pattern = common.ignoreTmpAndHiddenFile;

pattern.match('foo').should.be.true;
pattern.match('foo%').should.be.false;
pattern.match('foo~').should.be.false;
