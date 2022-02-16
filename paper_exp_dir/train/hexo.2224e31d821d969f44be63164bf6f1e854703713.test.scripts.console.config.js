'use strict';

const { mkdirs, readFile, rmdir, unlink, writeFile } = require('hexo-fs');
const { join } = require('path');
const { load } = require('js-yaml');
const { stub, assert: sinonAssert } = require('sinon');

describe('config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'config_test'), {silent: true});
const config = require('../../../lib/plugins/console/config').bind(hexo);

before(async () => {
await mkdirs(hexo.base_dir);
hexo.init();
});

beforeEach(() => writeFile(hexo.config_path, ''));

after(() => rmdir(hexo.base_dir));

it('read all config', async () => {
const logStub = stub(console, 'log');

try {
await config({_: []});
} finally {
logStub.restore();
}

sinonAssert.calledWith(logStub, hexo.config);
});

it('read config', async () => {
const logStub = stub(console, 'log');

try {
await config({_: ['title']});
} finally {
logStub.restore();
}

sinonAssert.calledWith(logStub, hexo.config.title);
});

it('read nested config', async () => {
const logStub = stub(console, 'log');

try {
hexo.config.server = {
port: 12345
};

await config({_: ['server.port']});
sinonAssert.calledWith(logStub, hexo.config.server.port);
} finally {
delete hexo.config.server;
logStub.restore();
