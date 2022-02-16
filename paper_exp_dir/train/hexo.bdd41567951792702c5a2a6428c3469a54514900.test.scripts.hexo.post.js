'use strict';

const { join } = require('path');
const moment = require('moment');
const Promise = require('bluebird');
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
err.code.should.eql('ENOENT');
}).finally(() => {
hexo.config.post_asset_folder = false;
unlink(path);
});
});

it('create() - follow the separator style in the scaffold', () => {
const scaffold = [
'---',
'title: {{ title }}',
'---'
].join('\n');

return hexo.scaffold.set('test', scaffold).then(() => post.create({
title: 'Hello World',
layout: 'test'
})).then(post => {
post.content.should.eql([
'---',
'title: Hello World',
'---'
].join('\n') + '\n');

return Promise.all([
unlink(post.path),
hexo.scaffold.remove('test')
]);
});
});

it('create() - JSON front-matter', () => {
const scaffold = [
'"title": {{ title }}',
';;;'
].join('\n');

return hexo.scaffold.set('test', scaffold).then(() => post.create({
title: 'Hello World',
layout: 'test',
lang: 'en'
})).then(post => {
post.content.should.eql([
'"title": "Hello World",',
'"lang": "en"',
';;;'
].join('\n') + '\n');

return Promise.all([
unlink(post.path),
hexo.scaffold.remove('test')
]);
});
});


it('create() - non-string title', () => {
const path = join(hexo.source_dir, '_posts', '12345.md');

return post.create({
title: 12345
}).then(data => {
data.path.should.eql(path);
return unlink(path);
});
});

it('create() - escape title', () => post.create({
title: 'Foo: Bar'
}).then(data => {
data.content.should.eql([

'---',
'title: \'Foo: Bar\'',
'date: ' + moment(now).format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n');
return unlink(data.path);
}));

it('create() - with content', () => {
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

return post.create({
title: 'Hello World',
content: 'Hello hexo'
}).then(post => {
post.path.should.eql(path);
post.content.should.eql(content);

return readFile(path);
}).then(data => {
data.should.eql(content);
return unlink(path);
});
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

it('publish()', () => {
let draftPath = '';
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');
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
layout: 'draft'
}).then(data => {
draftPath = data.path;

return post.publish({
slug: 'Hello-World'
});
}).then(post => {
post.path.should.eql(path);
post.content.should.eql(content);

return Promise.all([
exists(draftPath),
readFile(path)
]);
}).spread((exist, data) => {
exist.should.be.false;
data.should.eql(content);

return unlink(path);
});
});

it('publish() - layout', () => {
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
layout: 'draft'
}).then(data => post.publish({
slug: 'Hello-World',
layout: 'photo'
})).then(post => {
post.path.should.eql(path);
post.content.should.eql(content);

return readFile(path);
}).then(data => {
data.should.eql(content);

return unlink(path);
});
});

it('publish() - rename if target existed', () => {
const paths = [join(hexo.source_dir, '_posts', 'Hello-World-1.md')];

return Promise.all([
post.create({ title: 'Hello World', layout: 'draft' }),
post.create({ title: 'Hello World' })
]).then(data => {
paths.push(data[1].path);

return post.publish({
slug: 'Hello-World'
});
}).then(data => {
data.path.should.eql(paths[0]);
return paths;
}).map(item => unlink(item));
});

it('publish() - replace existing files', () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');

return Promise.all([
post.create({ title: 'Hello World', layout: 'draft' }),
post.create({ title: 'Hello World' })
]).then(data => post.publish({
slug: 'Hello-World'
}, true)).then(data => {
data.path.should.eql(path);
return unlink(path);
});
});

it('publish() - asset folder', () => {
const assetDir = join(hexo.source_dir, '_drafts', 'Hello-World');
const newAssetDir = join(hexo.source_dir, '_posts', 'Hello-World');
hexo.config.post_asset_folder = true;

return post.create({
title: 'Hello World',
layout: 'draft'
}).then(data =>
Promise.all([
writeFile(join(assetDir, 'a.txt'), 'a'),
writeFile(join(assetDir, 'b.txt'), 'b')
])).then(() => post.publish({
slug: 'Hello-World'
})).then(post => Promise.all([
exists(assetDir),
listDir(newAssetDir),
unlink(post.path)
])).spread((exist, files) => {
hexo.config.post_asset_folder = false;
exist.should.be.false;
files.should.have.members(['a.txt', 'b.txt']);
return rmdir(newAssetDir);
});
});


it('publish() - non-string title', () => {
const path = join(hexo.source_dir, '_posts', '12345.md');

return post.create({
title: 12345,
layout: 'draft'
}).then(data => post.publish({
slug: 12345
})).then(data => {
data.path.should.eql(path);
return unlink(path);
});
});

it('publish() - with callback', () => {
let draftPath = '';
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

return post.create({
title: 'Hello World',
layout: 'draft'
}).then(data => {
draftPath = data.path;

return post.publish({
slug: 'Hello-World'
}, callback);
}).then(post => {
callback.calledOnce.should.be.true;
callback.calledWithMatch(null, { path, content }).should.true;

return Promise.all([
exists(draftPath),
readFile(path)
]);
}).spread((exist, data) => {
exist.should.be.false;
data.should.eql(content);

return unlink(path);
});
});


it('publish() - preserve non-null data in drafts', () => post.create({
title: 'foo',
layout: 'draft',
tags: ['tag', 'test']
}).then(data => post.publish({
slug: 'foo'
})).then(data => {
const meta = yfm(data.content);
meta.tags.should.eql(['tag', 'test']);
return unlink(data.path);
}));

it('render()', () => {

const beforeHook = spy();
const afterHook = spy();

hexo.extend.filter.register('before_post_render', beforeHook);
hexo.extend.filter.register('after_post_render', afterHook);

return post.render(null, {
content: fixture.content,
engine: 'markdown'
}).then(data => {
data.content.trim().should.eql(fixture.expected);
beforeHook.calledOnce.should.be.true;
afterHook.calledOnce.should.be.true;
});
});

it('render() - callback', done => {
post.render(null, {
content: fixture.content,
engine: 'markdown'
}, err => {
done(err);
});
});

it('render() - file', () => {
const content = '**file test**';
const path = join(hexo.base_dir, 'render_test.md');

return writeFile(path, content).then(() => post.render(path)).then(data => {
data.content.trim().should.eql('<p><strong>file test</strong></p>');
return unlink(path);
});
});

it('render() - toString', () => {
const content = 'foo: 1';

return post.render(null, {
content,
engine: 'yaml'
}).then(data => {
data.content.should.eql('{"foo":1}');
});
});

it('render() - skip render phase if it\'s nunjucks file', () => {
const content = [
'{% quote Hello World %}',
'quote content',
'{% endquote %}'
].join('\n');

return post.render(null, {
content,
engine: 'njk'
}).then(data => {
data.content.trim().should.eql([
'<blockquote><p>quote content</p>\n',
'<footer><strong>Hello World</strong></footer></blockquote>'
].join(''));
});
});

it('render() - escaping nunjucks blocks with similar names', () => {
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

return post.render(null, {
content
}).then(data => {
data.content.trim().should.eql([
highlighted,
'',
highlighted
].join('\n'));
});
});

it('render() - recover escaped nunjucks blocks which is html escaped', () => {
const content = '`{% raw %}{{ test }}{% endraw %}`, {%raw%}{{ test }}{%endraw%}';

return post.render(null, {
content,
engine: 'markdown'
}).then(data => {
data.content.trim().should.eql('<p><code>{{ test }}</code>, {{ test }}</p>');
});
});

it.skip('render() - recover escaped nunjucks blocks which is html escaped before post_render', () => {
const content = '`{% raw %}{{ test }}{% endraw %}`';

const filter = spy();

hexo.extend.filter.register('after_render:html', filter);

return post.render(null, {
content,
engine: 'markdown'
}).then(data => {
filter.calledOnce.should.be.true;
filter.firstCall.args[0].trim().should.eql('<p><code>{{ test }}</code></p>');
hexo.extend.filter.unregister('after_render:html', filter);
});
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


it('render() - (disableNunjucks === true)', () => {
const renderer = hexo.render.renderer.get('markdown');
renderer.disableNunjucks = true;

return post.render(null, {
content: fixture.content,
engine: 'markdown'
}).then(data => {
data.content.trim().should.eql(fixture.expected_disable_nunjucks);
}).then(data => {
renderer.disableNunjucks = false;
});
});


it('render() - (disableNunjucks === false)', () => {
const renderer = hexo.render.renderer.get('markdown');
renderer.disableNunjucks = false;

return post.render(null, {
content: fixture.content,
engine: 'markdown'
}).then(data => {
data.content.trim().should.eql(fixture.expected);
}).then(data => {
renderer.disableNunjucks = false;
});
});


it('render() - (disableNunjucks === true) - sync', async () => {
const content = '{% link foo http://bar.com %}';
const loremFn = data => { return data.text.toUpperCase(); };
loremFn.disableNunjucks = true;
hexo.extend.renderer.register('coffee', 'js', loremFn, true);

const data = await post.render(null, { content, engine: 'coffee' });
data.content.should.eql(content.toUpperCase());
});

