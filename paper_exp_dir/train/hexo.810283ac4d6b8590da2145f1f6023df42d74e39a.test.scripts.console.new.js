'use strict';

const { exists, mkdirs, readFile, rmdir, unlink } = require('hexo-fs');
const moment = require('moment');
const { join } = require('path');
const Promise = require('bluebird');
const { useFakeTimers } = require('sinon');

describe('new', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'new_test'), {silent: true});
const n = require('../../../lib/plugins/console/new').bind(hexo);
const post = hexo.post;
const now = Date.now();
let clock;

before(async () => {
clock = useFakeTimers(now);

await mkdirs(hexo.base_dir);
await hexo.init();
await Promise.all([
hexo.scaffold.set('post', [
