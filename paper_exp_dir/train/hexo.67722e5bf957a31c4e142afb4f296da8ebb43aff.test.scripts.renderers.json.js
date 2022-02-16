var should = require('chai').should();

describe('json', () => {
var r = require('../../../lib/plugins/renderer/json');

it('normal', () => {
var data = {
foo: 1,
bar: {
baz: 2
}
