
var express = require('../');

describe('express', function(){
describe('exports', function(){
it('should have .version', function(){
express.should.have.property('version');
})

it('should expose connect middleware', function(){
