'use strict';

const { join, sep, resolve } = require('path');
const { writeFile, unlink, mkdirs, rmdir } = require('hexo-fs');
const { makeRe } = require('micromatch');

describe('Load config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'config_test'), { silent: true });
const loadConfig = require('../../../lib/hexo/load_config');
const defaultConfig = require('../../../lib/hexo/default_config');

hexo.env.init = true;

before(() => mkdirs(hexo.base_dir).then(() => hexo.init()));

after(() => rmdir(hexo.base_dir));

beforeEach(() => {
hexo.config = JSON.parse(JSON.stringify(defaultConfig));
});

it('config file does not exist', async () => {
await loadConfig(hexo);
hexo.config.should.eql(defaultConfig);
});

it('_config.yml exists', async () => {
const configPath = join(hexo.base_dir, '_config.yml');

try {
await writeFile(configPath, 'foo: 1');
await loadConfig(hexo);
hexo.config.foo.should.eql(1);
} finally {
await unlink(configPath);
}
});

it('_config.json exists', async () => {
const configPath = join(hexo.base_dir, '_config.json');

try {
await writeFile(configPath, '{"baz": 3}');
await loadConfig(hexo);
hexo.config.baz.should.eql(3);
} finally {
await unlink(configPath);
}
});

it('_config.txt exists', async () => {
const configPath = join(hexo.base_dir, '_config.txt');

try {
await writeFile(configPath, 'foo: 1');
await loadConfig(hexo);
hexo.config.should.eql(defaultConfig);
} finally {
await unlink(configPath);
}
});

it('custom config path', async () => {
const configPath = join(__dirname, 'werwerwer.yml');
hexo.config_path = join(__dirname, 'werwerwer.yml');

try {
await writeFile(configPath, 'foo: 1');
await loadConfig(hexo);
hexo.config.foo.should.eql(1);
} finally {
hexo.config_path = join(hexo.base_dir, '_config.yml');
await unlink(configPath);
}
});

it('custom config path with different extension name', async () => {
const realPath = join(__dirname, 'werwerwer.json');
hexo.config_path = join(__dirname, 'werwerwer.yml');

try {
await writeFile(realPath, '{"foo": 2}');
await loadConfig(hexo);
hexo.config.foo.should.eql(2);
hexo.config_path.should.eql(realPath);
} finally {
hexo.config_path = join(hexo.base_dir, '_config.yml');
await unlink(realPath);
}
});

it('handle trailing "/" of url', async () => {
const content = [
'root: foo',
'url: https://hexo.io/'
].join('\n');

try {
await writeFile(hexo.config_path, content);
await loadConfig(hexo);
hexo.config.root.should.eql('foo/');
hexo.config.url.should.eql('https://hexo.io');
} finally {
await unlink(hexo.config_path);
}
});

it('handle root is not exist', async () => {
try {
const content = 'url: https://hexo.io/';
await writeFile(hexo.config_path, content);
await loadConfig(hexo);
hexo.config.url.should.eql('https://hexo.io');
hexo.config.root.should.eql('/');
} finally {
await unlink(hexo.config_path);
}
