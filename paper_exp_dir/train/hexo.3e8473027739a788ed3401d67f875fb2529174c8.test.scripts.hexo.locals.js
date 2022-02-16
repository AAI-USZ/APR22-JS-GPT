'use strict';

var should = require('chai').should();
var sinon = require('sinon');

describe('Locals', function(){
var Locals = require('../../../lib/hexo/locals');
var locals = new Locals();

it('get() - name must be a string', function(){
var errorCallback = sinon.spy(function(err) {
err.should.have.property('message', 'name must be a string!');
});
