'use strict';

const fs = require('hexo-fs');

describe('clean', () => {
const Hexo = require('../../../lib/hexo');
let hexo, clean;

beforeEach(() => {
hexo = new Hexo(__dirname, {silent: true});
clean = require('../../../lib/plugins/console/clean').bind(hexo);
});
