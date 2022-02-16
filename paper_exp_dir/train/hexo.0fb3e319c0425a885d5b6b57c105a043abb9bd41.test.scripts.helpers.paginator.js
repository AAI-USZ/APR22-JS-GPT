'use strict';

const { url_for } = require('hexo-util');

describe('paginator', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
page: {
base: '',
total: 10
