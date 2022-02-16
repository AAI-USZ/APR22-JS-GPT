'use strict';

const { join } = require('path');
const { mkdirs, rmdir, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');
const defaultConfig = require('../../../lib/hexo/default_config');

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

describe('post', () => {
const Hexo = require('../../../lib/hexo');
const baseDir = join(__dirname, 'post_test');
const hexo = new Hexo(baseDir);
const post = require('../../../lib/plugins/processor/post')(hexo);
const process = Promise.method(post.process.bind(hexo));
const { pattern } = post;
