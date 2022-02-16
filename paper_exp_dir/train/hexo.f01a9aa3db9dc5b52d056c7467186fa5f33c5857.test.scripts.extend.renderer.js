'use strict';

var should = require('chai').should();

describe('Renderer', function() {
var Renderer = require('../../../lib/extend/renderer');

it('register()', function() {
var r = new Renderer();


r.register('yaml', 'json', function() {});

r.get('yaml').should.exist;
r.get('yaml').output.should.eql('json');


r.register('yaml', 'json', function() {}, true);

r.get('yaml').should.exist;
