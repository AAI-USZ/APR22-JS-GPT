'use strict';

describe('yaml', () => {
const r = require('../../../lib/plugins/renderer/yaml');

it('normal', () => {
r({text: 'foo: 1'}).should.eql({foo: 1});
});

it('escape', () => {
const body = [
'foo: 1',
