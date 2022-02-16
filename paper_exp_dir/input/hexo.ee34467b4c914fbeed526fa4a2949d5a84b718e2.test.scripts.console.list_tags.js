'use strict';

const Promise = require('bluebird');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('Console list', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const Post = hexo.model('Post');

const listTags = require('../../../lib/plugins/console/list/tag').bind(hexo);

hexo.config.permalink = ':title/';
