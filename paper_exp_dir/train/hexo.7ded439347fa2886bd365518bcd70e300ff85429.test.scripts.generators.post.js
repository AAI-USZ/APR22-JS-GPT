'use strict';

const should = require('chai').should();
const Promise = require('bluebird');

describe('post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname, {silent: true});
const Post = hexo.model('Post');
const generator = Promise.method(require('../../../lib/plugins/generator/post').bind(hexo));
