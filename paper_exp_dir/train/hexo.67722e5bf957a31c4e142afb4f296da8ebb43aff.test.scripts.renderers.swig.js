var should = require('chai').should();

describe('swig', () => {
var r = require('../../../lib/plugins/renderer/swig');

it('normal', () => {
var body = [
'Hello {{ name }}!'
].join('\n');

r({text: body}, {
