const should = require('chai').should();
const pathFn = require('path');
const moment = require('moment');
const Promise = require('bluebird');
const fs = require('hexo-fs');
const util = require('hexo-util');
const sinon = require('sinon');
const frontMatter = require('hexo-front-matter');
const fixture = require('../../fixtures/post_render');

describe('Post', () => {
const Hexo = require('../../../lib/hexo');
