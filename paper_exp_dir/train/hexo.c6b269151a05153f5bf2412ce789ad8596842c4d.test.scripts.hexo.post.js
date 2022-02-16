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

it('create() - JSON front-matter', async () => {
const scaffold = [
'"title": {{ title }}',
';;;'
].join('\n');

await hexo.scaffold.set('test', scaffold);
const result = await post.create({
title: 'Hello World',
layout: 'test',
lang: 'en'
});
result.content.should.eql([
'"title": "Hello World",',
'"lang": "en"',
';;;'
].join('\n') + '\n');

await Promise.all([
unlink(result.path),
hexo.scaffold.remove('test')
]);
});


it('create() - non-string title', async () => {
const path = join(hexo.source_dir, '_posts', '12345.md');

const result = await post.create({
title: 12345
});
result.path.should.eql(path);
await unlink(path);
});

it('create() - escape title', async () => {
const data = await post.create({
title: 'Foo: Bar'
});
data.content.should.eql([

'---',
'title: \'Foo: Bar\'',
'date: ' + moment(now).format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n');
await unlink(data.path);
});

it('create() - with content', async () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');
const date = moment(now);

const content = [
'---',
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---',
'',
'Hello hexo'
].join('\n');

const result = await post.create({
title: 'Hello World',
content: 'Hello hexo'
});
result.path.should.eql(path);
result.content.should.eql(content);

const data = await readFile(path);
data.should.eql(content);
await unlink(path);
});

it('create() - with callback', done => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');
const date = moment(now);

const content = [
'---',
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

post.create({ title: 'Hello World' }, (err, post) => {
if (err) {
done(err);
return;
}
try {
post.path.should.eql(path);
post.content.should.eql(content);
readFile(path).asCallback((err, data) => {
if (err) {
done(err);
return;
}
try {
data.should.eql(content);
unlink(path).asCallback(done);
} catch (e) {
done(e);
}
});
} catch (e) {
done(e);
}
});
});

it('publish()', async () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');
const date = moment(now);

const content = [
'---',
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

const data = await post.create({
title: 'Hello World',
layout: 'draft'
});
const draftPath = data.path;
const result = await post.publish({
slug: 'Hello-World'
});
result.path.should.eql(path);
result.content.should.eql(content);

const exist = await exists(draftPath);
exist.should.be.false;

const newdata = await readFile(path);
newdata.should.eql(content);

await unlink(path);
});

it('publish() - layout', async () => {
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

await post.create({
title: 'Hello World',
layout: 'draft'
});
const result = await post.publish({
slug: 'Hello-World',
layout: 'photo'
});
result.path.should.eql(path);
result.content.should.eql(content);

const data = await readFile(path);
data.should.eql(content);

await unlink(path);
});

it('publish() - rename if target existed', async () => {
const paths = [join(hexo.source_dir, '_posts', 'Hello-World-1.md')];

const result = await Promise.all([
post.create({ title: 'Hello World', layout: 'draft' }),
post.create({ title: 'Hello World' })
]);
paths.push(result[1].path);

const data = await post.publish({
slug: 'Hello-World'
});
data.path.should.eql(paths[0]);

for (const path of paths) {
await unlink(path);
}
});

it('publish() - replace existing files', async () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');

await Promise.all([
post.create({ title: 'Hello World', layout: 'draft' }),
post.create({ title: 'Hello World' })
]);
const data = await post.publish({
slug: 'Hello-World'
}, true);
data.path.should.eql(path);
await unlink(path);
});

it('publish() - asset folder', async () => {
const assetDir = join(hexo.source_dir, '_drafts', 'Hello-World');
const newAssetDir = join(hexo.source_dir, '_posts', 'Hello-World');
hexo.config.post_asset_folder = true;

await post.create({
title: 'Hello World',
layout: 'draft'
});

await Promise.all([
writeFile(join(assetDir, 'a.txt'), 'a'),
writeFile(join(assetDir, 'b.txt'), 'b')
]);
const result = await post.publish({
slug: 'Hello-World'
});

const exist = await exists(assetDir);
exist.should.be.false;
const files = await listDir(newAssetDir);
files.should.have.members(['a.txt', 'b.txt']);

await unlink(result.path);

await rmdir(newAssetDir);
});


it('publish() - non-string title', async () => {
const path = join(hexo.source_dir, '_posts', '12345.md');

await post.create({
title: 12345,
layout: 'draft'
});
const data = await post.publish({
slug: 12345
});
data.path.should.eql(path);
await unlink(path);
});

it('publish() - with callback', async () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');
const date = moment(now);

const content = [
'---',
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

const callback = spy();

const data = await post.create({
title: 'Hello World',
layout: 'draft'
});
const draftPath = data.path;

await post.publish({
slug: 'Hello-World'
}, callback);
callback.calledOnce.should.be.true;
callback.calledWithMatch(null, { path, content }).should.true;

const exist = await exists(draftPath);
exist.should.be.false;

const newdata = await readFile(path);
newdata.should.eql(content);

await unlink(path);
});


it('publish() - preserve non-null data in drafts', async () => {
await post.create({
title: 'foo',
layout: 'draft',
tags: ['tag', 'test']
});
const data = await post.publish({
slug: 'foo'
});
const meta = yfm(data.content);
meta.tags.should.eql(['tag', 'test']);
await unlink(data.path);
});

it('render()', async () => {

const beforeHook = spy();
const afterHook = spy();

hexo.extend.filter.register('before_post_render', beforeHook);
hexo.extend.filter.register('after_post_render', afterHook);

const data = await post.render(null, {
content: fixture.content,
engine: 'markdown'
});
data.content.trim().should.eql(fixture.expected);
beforeHook.calledOnce.should.be.true;
afterHook.calledOnce.should.be.true;
});

it('render() - callback', done => {
post.render(null, {
content: fixture.content,
engine: 'markdown'
}, err => {
done(err);
});
});

it('render() - file', async () => {
const content = '**file test**';
const path = join(hexo.base_dir, 'render_test.md');

await writeFile(path, content);
const data = await post.render(path);
data.content.trim().should.eql('<p><strong>file test</strong></p>');
await unlink(path);
});

it('render() - toString', async () => {
const content = 'foo: 1';

const data = await post.render(null, {
content,
engine: 'yaml'
});
data.content.should.eql('{"foo":1}');
});

it('render() - skip render phase if it\'s nunjucks file', async () => {
const content = [
'{% quote Hello World %}',
'quote content',
'{% endquote %}'
].join('\n');

const data = await post.render(null, {
content,
engine: 'njk'
});
data.content.trim().should.eql([
'<blockquote><p>quote content</p>\n',
'<footer><strong>Hello World</strong></footer></blockquote>'
].join(''));
});

it('render() - escaping nunjucks blocks with similar names', async () => {
const code = 'alert("Hello world")';
const highlighted = highlight(code);

const content = [
'{% codeblock %}',
code,
'{% endcodeblock %}',
'',
'{% code %}',
code,
'{% endcode %}'
].join('\n');

const data = await post.render(null, {
content
});
data.content.trim().should.eql([
highlighted,
'',
highlighted
].join('\n'));
});

it('render() - recover escaped nunjucks blocks which is html escaped', async () => {
const content = '`{% raw %}{{ test }}{% endraw %}`, {%raw%}{{ test }}{%endraw%}';

const data = await post.render(null, {
content,
engine: 'markdown'
});
data.content.trim().should.eql('<p><code>{{ test }}</code>, {{ test }}</p>');
});

it.skip('render() - recover escaped nunjucks blocks which is html escaped before post_render', async () => {
const content = '`{% raw %}{{ test }}{% endraw %}`';

const filter = spy();

hexo.extend.filter.register('after_render:html', filter);

await post.render(null, {
content,
engine: 'markdown'
});
filter.calledOnce.should.be.true;
filter.firstCall.args[0].trim().should.eql('<p><code>{{ test }}</code></p>');
hexo.extend.filter.unregister('after_render:html', filter);
});

it('render() - callback - not path and file', callback => {
post.render(null, {}, (err, result) => {
try {
err.should.be.exist;
err.should.be.instanceof(Error);
err.should.be.have.property('message', 'No input file or string!');
should.not.exist(result);
} catch (e) {
callback(e);
return;
}
callback();
});
});


it('render() - (disableNunjucks === true)', async () => {
const renderer = hexo.render.renderer.get('markdown');
renderer.disableNunjucks = true;

try {
const data = await post.render(null, {
content: fixture.content,
engine: 'markdown'
});
data.content.trim().should.eql(fixture.expected_disable_nunjucks);
} finally {
renderer.disableNunjucks = false;
}
});


it('render() - (disableNunjucks === false)', async () => {
const renderer = hexo.render.renderer.get('markdown');
renderer.disableNunjucks = false;

try {
const data = await post.render(null, {
content: fixture.content,
engine: 'markdown'
});
data.content.trim().should.eql(fixture.expected);
} finally {
renderer.disableNunjucks = false;
}
});


it('render() - (disableNunjucks === true) - sync', async () => {
const content = '{% link foo http://bar.com %}';
const loremFn = data => { return data.text.toUpperCase(); };
loremFn.disableNunjucks = true;
hexo.extend.renderer.register('coffee', 'js', loremFn, true);

const data = await post.render(null, { content, engine: 'coffee' });
data.content.should.eql(content.toUpperCase());
});


it('render() - (disableNunjucks === false) - sync', async () => {
const content = '{% link foo http://bar.com %}';
const loremFn = data => { return data.text.toUpperCase(); };
loremFn.disableNunjucks = false;
hexo.extend.renderer.register('coffee', 'js', loremFn, true);

const data = await post.render(null, { content, engine: 'coffee' });
data.content.should.not.eql(content.toUpperCase());
});

it('render() - (disableNunjucks === true) - front-matter', async () => {
const renderer = hexo.render.renderer.get('markdown');
renderer.disableNunjucks = true;

try {
const data = await post.render(null, {
content: fixture.content,
engine: 'markdown',
disableNunjucks: false
});
