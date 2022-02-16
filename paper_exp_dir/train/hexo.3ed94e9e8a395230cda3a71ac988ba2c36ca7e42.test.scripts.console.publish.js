'use strict';

const { exists, mkdirs, readFile, rmdir, unlink } = require('hexo-fs');
const moment = require('moment');
const { join } = require('path');
const Promise = require('bluebird');
const { useFakeTimers } = require('sinon');

describe('publish', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'publish_test'), {silent: true});
const publish = require('../../../lib/plugins/console/publish').bind(hexo);
const post = hexo.post;
const now = Date.now();
let clock;

before(async() => {
clock = useFakeTimers(now);

await mkdirs(hexo.base_dir);
await hexo.init();
await hexo.scaffold.set('post', [
'---',
