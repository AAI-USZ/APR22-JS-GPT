const should = require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');
const moment = require('moment');
const Promise = require('bluebird');
const fs = require('hexo-fs');

const NEW_POST_NAME = ':title.md';

describe('new_post_path', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'new_post_path_test'));
const newPostPath = require('../../../lib/plugins/filter/new_post_path').bind(hexo);
