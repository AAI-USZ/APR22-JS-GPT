'use strict';

const { join } = require('path');
const moment = require('moment');
const { createSha1Hash } = require('hexo-util');
const { mkdirs, rmdir, unlink, writeFile } = require('hexo-fs');

describe('new_post_path', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'new_post_path_test'));
const newPostPath = require('../../../lib/plugins/filter/new_post_path').bind(hexo);
const sourceDir = hexo.source_dir;
