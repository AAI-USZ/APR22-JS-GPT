var should = require('chai').should();

describe('yaml', () => {
var r = require('../../../lib/plugins/renderer/yaml');

it('normal', () => {
r({text: 'foo: 1'}).should.eql({foo: 1});
});

it('escape', () => {
var body = [
