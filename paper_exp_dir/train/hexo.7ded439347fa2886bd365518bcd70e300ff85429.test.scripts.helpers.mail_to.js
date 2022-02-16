'use strict';

require('chai').should();
const qs = require('querystring');

describe('mail_to', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
