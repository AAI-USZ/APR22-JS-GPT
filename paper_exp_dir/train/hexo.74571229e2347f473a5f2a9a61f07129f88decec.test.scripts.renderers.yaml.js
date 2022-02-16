'use strict';

var should = require('chai').should();

describe('yaml', function(){
var r = require('../../../lib/plugins/renderer/yaml');

it('normal', function(){
r({text: 'foo: 1'}).should.eql({foo: 1});
});

