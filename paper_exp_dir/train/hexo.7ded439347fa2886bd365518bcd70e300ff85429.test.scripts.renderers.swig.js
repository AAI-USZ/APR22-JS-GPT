'use strict';

require('chai').should();

describe('swig', () => {
const r = require('../../../lib/plugins/renderer/swig');

it('normal', () => {
const body = [
'Hello {{ name }}!'
].join('\n');
