'use strict';

const { mkdirs, readFile, rmdir, unlink, writeFile } = require('hexo-fs');
const { join } = require('path');
const { load } = require('js-yaml');
const rewire = require('rewire');
const sinon = require('sinon');

describe('config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'config_test'), {silent: true});
const config = require('../../../lib/plugins/console/config').bind(hexo);
const configModule = rewire('../../../lib/plugins/console/config');

before(async () => {
await mkdirs(hexo.base_dir);
hexo.init();
});

beforeEach(() => writeFile(hexo.config_path, ''));

after(() => rmdir(hexo.base_dir));

it('read all config', async () => {
const spy = sinon.spy();

await configModule.__with__({
console: {
log: spy
}
})(() => configModule.call(hexo, {_: []}));

spy.args[0][0].should.eql(hexo.config);
});

it('read config', async () => {
const spy = sinon.spy();

await configModule.__with__({
console: {
log: spy
}
})(() => configModule.call(hexo, {_: ['title']}));

spy.args[0][0].should.eql(hexo.config.title);
});

it('read nested config', () => {
const spy = sinon.spy();

hexo.config.server = {
port: 12345
};

return configModule.__with__({
console: {
log: spy
}
})(() => configModule.call(hexo, {_: ['server.port']})).then(() => {
spy.args[0][0].should.eql(hexo.config.server.port);
}).finally(() => {
delete hexo.config.server;
});
});

async function writeConfig(...args) {
await config({_: args});
const content = await readFile(hexo.config_path);
return load(content);
}

it('write config', async () => {
const config = await writeConfig('title', 'My Blog');
config.title.should.eql('My Blog');
});
