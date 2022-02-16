const should = require('chai').should();
const fs = require('hexo-fs');
const moment = require('moment');
const pathFn = require('path');
const Promise = require('bluebird');
const sinon = require('sinon');

describe('publish', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'publish_test'), {silent: true});
const publish = require('../../../lib/plugins/console/publish').bind(hexo);
const post = hexo.post;
