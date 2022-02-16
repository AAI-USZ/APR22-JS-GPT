'use strict';

describe('swig', () => {
const r = require('../../../lib/plugins/renderer/swig');

it('normal', () => {
const body = [
'Hello {{ name }}!'
].join('\n');

r({text: body}, {
name: 'world'
