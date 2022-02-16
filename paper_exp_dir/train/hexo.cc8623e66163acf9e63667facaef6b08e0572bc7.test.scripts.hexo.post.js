'use strict';

const { join } = require('path');
const moment = require('moment');
const { readFile, mkdirs, unlink, rmdir, writeFile, exists, stat, listDir } = require('hexo-fs');
const { highlight, escapeHTML } = require('hexo-util');
const { spy, useFakeTimers } = require('sinon');
const { parse: yfm } = require('hexo-front-matter');
const fixture = require('../../fixtures/post_render');
const escapeSwigTag = str => str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');

describe('Post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'post_test'));
