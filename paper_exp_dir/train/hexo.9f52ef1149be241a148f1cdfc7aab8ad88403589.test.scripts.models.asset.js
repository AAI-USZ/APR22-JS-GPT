'use strict';

const sinon = require('sinon');
const pathFn = require('path');

describe('Asset', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Asset = hexo.model('Asset');

it('default values', () => Asset.insert({
_id: 'foo',
