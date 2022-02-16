'use strict';

const { join } = require('path');
const { emptyDir, exists, mkdirs, readFile, rmdir, stat, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');
const { spy } = require('sinon');

describe('generate', () => {
const Hexo = require('../../../lib/hexo');
const generateConsole = require('../../../lib/plugins/console/generate');
let hexo, generate;

beforeEach(async () => {
hexo = new Hexo(join(__dirname, 'generate_test'), {silent: true});
generate = generateConsole.bind(hexo);

await mkdirs(hexo.base_dir);
hexo.init();
});

afterEach(async () => {
