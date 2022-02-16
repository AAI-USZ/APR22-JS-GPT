'use strict';

var should = require('chai').should();
var assert = require('chai').assert;
var sinon = require('sinon');

describe('Filter', function(){
var Filter = require('../../../lib/extend/filter');

it('register()', function(){
var f = new Filter();


f.register('test', function(){});
