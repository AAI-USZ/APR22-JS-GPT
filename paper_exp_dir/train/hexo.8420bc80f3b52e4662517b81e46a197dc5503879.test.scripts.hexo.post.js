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
const { post } = hexo;
const now = Date.now();
let clock;
let defaultCfg = {};

before(async () => {
clock = useFakeTimers(now);

await mkdirs(hexo.base_dir);
await hexo.init();


await hexo.loadPlugin(require.resolve('hexo-renderer-marked'));
await hexo.scaffold.set('post', [
'---',
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'
].join('\n'));
await hexo.scaffold.set('draft', [
'---',
'title: {{ title }}',
'tags:',
'---'
].join('\n'));

defaultCfg = JSON.parse(JSON.stringify(hexo.config));
});

after(() => {
clock.restore();
return rmdir(hexo.base_dir);
});

afterEach(() => {
hexo.config = JSON.parse(JSON.stringify(defaultCfg));
});

it('create()', async () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');
const date = moment(now);
const listener = spy();

const content = [
'---',
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

hexo.once('new', listener);

const result = await post.create({
title: 'Hello World'
});
result.path.should.eql(path);
result.content.should.eql(content);
listener.calledOnce.should.be.true;

const data = await readFile(path);
data.should.eql(content);
await unlink(path);
});

it('create() - slug', async () => {
const path = join(hexo.source_dir, '_posts', 'foo.md');
const date = moment(now);

const content = [
'---',
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

const result = await post.create({
title: 'Hello World',
slug: 'foo'
});
result.path.should.eql(path);
result.content.should.eql(content);

const data = await readFile(path);
data.should.eql(content);
await unlink(path);
});

it('create() - filename_case', async () => {
hexo.config.filename_case = 1;

const path = join(hexo.source_dir, '_posts', 'hello-world.md');
const date = moment(now);

const content = [
'---',
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

const result = await post.create({
title: 'Hello World'
});
result.path.should.eql(path);
result.content.should.eql(content);

const data = await readFile(path);
data.should.eql(content);
await unlink(path);
});

it('create() - layout', async () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');
const date = moment(now);

const content = [
'---',
'layout: photo',
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

const result = await post.create({
title: 'Hello World',
layout: 'photo'
});
result.path.should.eql(path);
result.content.should.eql(content);

const data = await readFile(path);
data.should.eql(content);
await unlink(path);
});

it('create() - extra data', async () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');
const date = moment(now);

const content = [
'---',
'title: Hello World',
'foo: bar',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

const result = await post.create({
title: 'Hello World',
foo: 'bar'
});
result.path.should.eql(path);
result.content.should.eql(content);

const data = await readFile(path);
data.should.eql(content);
await unlink(path);
});

it('create() - rename if target existed', async () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World-1.md');

await post.create({
title: 'Hello World'
});
const result = await post.create({
title: 'Hello World'
});
result.path.should.eql(path);
const exist = await exists(path);
exist.should.be.true;

await Promise.all([
unlink(path),
unlink(join(hexo.source_dir, '_posts', 'Hello-World.md'))
]);
});

it('create() - replace existing files', async () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');

await post.create({
title: 'Hello World'
});
const result = await post.create({
title: 'Hello World'
}, true);
result.path.should.eql(path);
await unlink(path);
});

it('create() - asset folder', async () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World');

hexo.config.post_asset_folder = true;

await post.create({
title: 'Hello World'
});
const stats = await stat(path);
stats.isDirectory().should.be.true;
await unlink(path + '.md');
});

it('create() - page', async () => {
const path = join(hexo.source_dir, 'Hello-World/index.md');
hexo.config.post_asset_folder = true;
const result = await post.create({
title: 'Hello World',
layout: 'page'
});
result.path.should.eql(path);

try {
await stat(join(hexo.source_dir, 'Hello-World/index'));
should.fail();
} catch (err) {
err.code.should.eql('ENOENT');
} finally {
await unlink(path);
}
});

it('create() - follow the separator style in the scaffold', async () => {
const scaffold = [
'---',
'title: {{ title }}',
'---'
].join('\n');

await hexo.scaffold.set('test', scaffold);
const result = await post.create({
title: 'Hello World',
layout: 'test'
});
result.content.should.eql([
'---',
'title: Hello World',
'---'
].join('\n') + '\n');

await Promise.all([
unlink(result.path),
hexo.scaffold.remove('test')
]);
});


it('create() - avoid quote if unnecessary', async () => {
const scaffold = [
'---',
'title: {{ title }}',
'---'
].join('\n');

await hexo.scaffold.set('test', scaffold);
const result = await post.create({
