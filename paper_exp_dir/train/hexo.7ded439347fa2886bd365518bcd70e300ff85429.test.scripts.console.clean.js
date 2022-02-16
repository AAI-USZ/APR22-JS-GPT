'use strict';

require('chai').should();
const fs = require('hexo-fs');

describe('clean', () => {
const Hexo = require('../../../lib/hexo');
let hexo, clean;

beforeEach(() => {
