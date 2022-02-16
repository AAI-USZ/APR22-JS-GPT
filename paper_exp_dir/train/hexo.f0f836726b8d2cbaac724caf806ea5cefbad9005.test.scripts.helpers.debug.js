'use strict';

var should = require('chai').should();
var rewire = require('rewire');
var sinon = require('sinon');

describe('debug', function() {
var debug = require('../../../lib/plugins/helper/debug');
var debugModule = rewire('../../../lib/plugins/helper/debug');
var inspect = require('util').inspect;

it('inspect simple object', function() {
var obj = { foo: 'bar' };
