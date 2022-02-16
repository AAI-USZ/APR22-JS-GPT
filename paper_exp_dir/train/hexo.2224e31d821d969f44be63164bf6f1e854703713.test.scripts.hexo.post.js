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

return mkdirs(hexo.base_dir, () => hexo.init()).then(() =>
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

it('create() - with callback', () => {
const path = join(hexo.source_dir, '_posts', 'Hello-World.md');
const date = moment(now);

const content = [
'---',
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

const callback = spy(post => {
post.path.should.eql(path);
post.content.should.eql(content);
});

return post.create({
title: 'Hello World'
}, callback).then(post => {
callback.calledOnce.should.be.true;
return readFile(path);
}).then(data => {
data.should.eql(content);
return unlink(path);
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
post.create({title: 'Hello World', layout: 'draft'}),
post.create({title: 'Hello World'})
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
post.create({title: 'Hello World', layout: 'draft'}),
post.create({title: 'Hello World'})
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
