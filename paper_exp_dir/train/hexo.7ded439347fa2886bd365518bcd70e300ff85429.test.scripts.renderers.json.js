'use strict';

require('chai').should();

describe('json', () => {
const r = require('../../../lib/plugins/renderer/json');

it('normal', () => {
const data = {
foo: 1,
bar: {
