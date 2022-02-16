'use strict';

const { join, sep } = require('path');
const { appendFile, mkdir, mkdirs, rename, rmdir, stat, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');
const { hash, Pattern } = require('hexo-util');
const { spy, match, assert: sinonAssert } = require('sinon');

describe('Box', () => {
const Hexo = require('../../../lib/hexo');
const baseDir = join(__dirname, 'box_tmp');
const Box = require('../../../lib/box');

const newBox = (path, config) => {
const hexo = new Hexo(baseDir, { silent: true });
hexo.config = Object.assign(hexo.config, config);
const base = path ? join(baseDir, path) : baseDir;
return new Box(hexo, base);
};

before(() => mkdir(baseDir));

after(() => rmdir(baseDir));

it('constructor - add trailing "/" to the base path', () => {
const box = newBox('foo');
box.base.should.eql(join(baseDir, 'foo') + sep);
});

it('addProcessor() - no pattern', () => {
const box = newBox();

box.addProcessor(() => 'test');

const p = box.processors[0];

p.pattern.match('').should.eql({});
p.process().should.eql('test');
});

it('addProcessor() - with regex', () => {
const box = newBox();

box.addProcessor(/^foo/, () => 'test');

const p = box.processors[0];

p.pattern.match('foobar').should.be.ok;
p.pattern.should.be.an.instanceof(Pattern);
p.process().should.eql('test');
});

it('addProcessor() - with pattern', () => {
const box = newBox();

box.addProcessor(new Pattern(/^foo/), () => 'test');

const p = box.processors[0];

p.pattern.match('foobar').should.be.ok;
p.pattern.should.be.an.instanceof(Pattern);
p.process().should.eql('test');
});

it('addProcessor() - no fn', () => {
const box = newBox();

should.throw(() => box.addProcessor('test'), 'fn must be a function');
});

it('process()', async () => {
const box = newBox('test');
const data = {};

box.addProcessor(file => {
data[file.path] = file;
});

await Promise.all([
writeFile(join(box.base, 'a.txt'), 'a'),
writeFile(join(box.base, 'b', 'c.js'), 'c')
]);

await box.process();

for (const [key, item] of Object.entries(data)) {
item.path.should.eql(key);
item.source.should.eql(join(box.base, key));
item.type.should.eql('create');
item.params.should.eql({});
}

await rmdir(box.base);
});

it('process() - do nothing if target does not exist', async () => {
const box = newBox('test');

return box.process();
});

it('process() - create', async () => {
const box = newBox('test');
const name = 'a.txt';
const path = join(box.base, name);

const processor = spy();
box.addProcessor(processor);

await writeFile(path, 'a');
await box.process();

sinonAssert.calledWithMatch(processor, { type: 'create', path: name });

await rmdir(box.base);
});

it('process() - update (mtime changed and hash changed)', async () => {
const box = newBox('test');
const name = 'a.txt';
const path = join(box.base, name);
const cacheId = 'test/' + name;

const processor = spy();
box.addProcessor(processor);

await Promise.all([
writeFile(path, 'a'),
box.Cache.insert({
_id: cacheId,
modified: 0,
hash: hash('b').toString('hex')
})
]);
await box.process();

sinonAssert.calledWithMatch(processor, { type: 'update', path: name });

await rmdir(box.base);
});

it('process() - skip (mtime changed but hash matched)', async () => {
const box = newBox('test');
const name = 'a.txt';
const path = join(box.base, name);
const cacheId = 'test/' + name;

const processor = spy();
box.addProcessor(processor);

await writeFile(path, 'a');
await stat(path);
await box.Cache.insert({
_id: cacheId,
modified: 0,
hash: hash('a').toString('hex')
});
await box.process();

sinonAssert.calledWithMatch(processor, { type: 'skip', path: name });

await rmdir(box.base);
});

it('process() - skip (hash changed but mtime matched)', async () => {
const box = newBox('test');
const name = 'a.txt';
const path = join(box.base, name);
const cacheId = 'test/' + name;

const processor = spy();
box.addProcessor(processor);

await writeFile(path, 'a');
const stats = await stat(path);
await box.Cache.insert({
_id: cacheId,
modified: stats.mtime,
hash: hash('b').toString('hex')
});
await box.process();

sinonAssert.calledWithMatch(processor, { type: 'skip', path: name });

await rmdir(box.base);
});

it('process() - skip (mtime matched and hash matched)', async () => {
const box = newBox('test');
const name = 'a.txt';
const path = join(box.base, name);
const cacheId = 'test/' + name;

const processor = spy();
box.addProcessor(processor);

await writeFile(path, 'a');
const stats = await stat(path);
await box.Cache.insert({
_id: cacheId,
modified: stats.mtime,
hash: hash('a').toString('hex')
});
await box.process();

sinonAssert.calledWithMatch(processor, { type: 'skip', path: name });

await rmdir(box.base);
});

it('process() - delete', async () => {
const box = newBox('test');
const cacheId = 'test/a.txt';

const processor = spy();
box.addProcessor(processor);

await Promise.all([
mkdirs(box.base),
box.Cache.insert({
_id: cacheId
})
]);
await box.process();

sinonAssert.calledWith(processor, match.has('type', 'delete'));
processor.calledOnce.should.be.true;

await rmdir(box.base);
});

it('process() - params', async () => {
const box = newBox('test');
const path = join(box.base, 'posts', '123456');

const processor = spy();

box.addProcessor('posts/:id', processor);

await writeFile(path, 'a');
await box.process();

sinonAssert.calledWith(processor, match.has('params', match.has('id', '123456')));
processor.calledOnce.should.be.true;

await rmdir(box.base);
});

it('process() - handle null ignore', async () => {
const box = newBox('test', { ignore: null });
const data = {};

box.addProcessor(file => {
data[file.path] = file;
});

await writeFile(join(box.base, 'foo.txt'), 'foo');
await box.process();

data.should.have.all.keys(['foo.txt']);

await rmdir(box.base);
});

it('process() - skip files if they match a glob epression in ignore', async () => {
const box = newBox('test', { ignore: '**/ignore_me' });
const data = {};

box.addProcessor(file => {
data[file.path] = file;
});

await Promise.all([
writeFile(join(box.base, 'foo.txt'), 'foo'),
writeFile(join(box.base, 'ignore_me', 'bar.txt'), 'ignore_me')
]);
await box.process();

data.should.have.all.keys(['foo.txt']);

await rmdir(box.base);
});

it('process() - skip files if they match any of the glob expressions in ignore', async () => {
const box = newBox('test', { ignore: ['**/ignore_me', '**/ignore_me_too.txt'] });
const data = {};

box.addProcessor(file => {
data[file.path] = file;
});

await Promise.all([
writeFile(join(box.base, 'foo.txt'), 'foo'),
writeFile(join(box.base, 'ignore_me', 'bar.txt'), 'ignore_me'),
writeFile(join(box.base, 'ignore_me_too.txt'), 'ignore_me_too')
]);
await box.process();

data.should.have.all.keys(['foo.txt']);

await rmdir(box.base);
});

it('watch() - create', async () => {
const box = newBox('test');
const path = 'a.txt';
const src = join(box.base, path);
const processor = spy();

box.addProcessor(processor);

await writeFile(src, 'a');
await box.watch();
box.isWatching().should.be.true;
await Promise.delay(500);

sinonAssert.calledWithMatch(processor.firstCall, {
source: src,
path: path,
type: 'create',
params: {}
});
