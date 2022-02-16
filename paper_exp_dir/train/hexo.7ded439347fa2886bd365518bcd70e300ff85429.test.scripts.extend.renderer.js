'use strict';

const should = require('chai').should();

describe('Renderer', () => {
const Renderer = require('../../../lib/extend/renderer');

it('register()', () => {
const r = new Renderer();


r.register('yaml', 'json', () => {});
