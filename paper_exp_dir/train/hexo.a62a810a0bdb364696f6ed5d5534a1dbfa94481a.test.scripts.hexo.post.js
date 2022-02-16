'use strict';

const { join } = require('path');
const moment = require('moment');
const Promise = require('bluebird');
const { readFile, mkdirs, unlink, rmdir, writeFile, exists, stat, listDir } = require('hexo-fs');
const { highlight } = require('hexo-util');
const { spy, useFakeTimers } = require('sinon');
const frontMatter = require('hexo-front-matter');
const fixture = require('../../fixtures/post_render');

describe('Post', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'post_test'));
const { post } = hexo;
const now = Date.now();
let clock;

before(() => {
clock = useFakeTimers(now);

return mkdirs(hexo.base_dir).then(() => hexo.init()).then(() =>
hexo.loadPlugin(require.resolve('hexo-renderer-marked'))).then(() => hexo.scaffold.set('post', [
'---',
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'
].join('\n'))).then(() => hexo.scaffold.set('draft', [
'---',
'title: {{ title }}',
'tags:',
'---'
].join('\n')));
});

after(() => {
clock.restore();
return rmdir(hexo.base_dir);
});

it('create()', () => {
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

return post.create({
title: 'Hello World'
}).then(post => {
post.path.should.eql(path);
post.content.should.eql(content);
listener.calledOnce.should.be.true;

return readFile(path);
}).then(data => {
data.should.eql(content);
return unlink(path);
});
});

it('create() - slug', () => {
const path = join(hexo.source_dir, '_posts', 'foo.md');
const date = moment(now);

const content = [
'---',
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

return post.create({
title: 'Hello World',
slug: 'foo'
}).then(post => {
post.path.should.eql(path);
post.content.should.eql(content);

return readFile(path);
}).then(data => {
data.should.eql(content);
return unlink(path);
});
});

it('create() - filename_case', () => {
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

return post.create({
title: 'Hello World'
}).then(post => {
post.path.should.eql(path);
post.content.should.eql(content);
hexo.config.filename_case = 0;

return readFile(path);
}).then(data => {
data.should.eql(content);
return unlink(path);
});
});

it('create() - layout', () => {
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

return post.create({
title: 'Hello World',
layout: 'photo'
}).then(post => {
post.path.should.eql(path);
post.content.should.eql(content);

return readFile(path);
}).then(data => {
data.should.eql(content);
return unlink(path);
});
});

it('create() - extra data', () => {
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

return post.create({
title: 'Hello World',
foo: 'bar'
}).then(post => {
post.path.should.eql(path);
post.content.should.eql(content);

return readFile(path);
}).then(data => {
data.should.eql(content);
return unlink(path);
});
});

it('create() - rename if target existed', () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World-1.md');

return post.create({
title: 'Hello World'
}).then(() => post.create({
title: 'Hello World'
})).then(post => {
post.path.should.eql(path);
return exists(path);
}).then(exist => {
exist.should.be.true;

return Promise.all([
unlink(path),
unlink(join(hexo.source_dir, '_posts', 'Hello-World.md'))
]);
});
});

it('create() - replace existing files', () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');

return post.create({
title: 'Hello World'
}).then(() => post.create({
title: 'Hello World'
}, true)).then(post => {
post.path.should.eql(path);
return unlink(path);
});
});

it('create() - asset folder', () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World');

hexo.config.post_asset_folder = true;

return post.create({
title: 'Hello World'
}).then(post => {
hexo.config.post_asset_folder = false;
return stat(path);
}).then(stats => {
stats.isDirectory().should.be.true;
return unlink(path + '.md');
});
});

it('create() - page', () => {
const path = join(hexo.source_dir, 'Hello-World/index.md');
hexo.config.post_asset_folder = true;
return post.create({
title: 'Hello World',
layout: 'page'
}).then(post => {
post.path.should.eql(path);
return stat(join(hexo.source_dir, 'Hello-World/index'));
}).catch(err => {
