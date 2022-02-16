'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const util = require('hexo-util');
const sinon = require('sinon');
const Pattern = util.Pattern;

describe('Box', () => {
const Hexo = require('../../../lib/hexo');
const baseDir = pathFn.join(__dirname, 'box_tmp');
const Box = require('../../../lib/box');

function newBox(path, config) {
const hexo = new Hexo(baseDir, {silent: true});
hexo.config = Object.assign(hexo.config, config);
const base = path ? pathFn.join(baseDir, path) : baseDir;
return new Box(hexo, base);
}

before(() => fs.mkdir(baseDir));

after(() => fs.rmdir(baseDir));

it('constructor - add trailing "/" to the base path', () => {
const box = newBox('foo');
box.base.should.eql(pathFn.join(baseDir, 'foo') + pathFn.sep);
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
const errorCallback = sinon.spy(err => {
err.should.have.property('message', 'fn must be a function');
});

try {
box.addProcessor('test');
} catch (err) {
errorCallback(err);
}

errorCallback.calledOnce.should.be.true;
});

it('process()', () => {
const box = newBox('test');
const data = {};

box.addProcessor(file => {
data[file.path] = file;
});

return Promise.all([
fs.writeFile(pathFn.join(box.base, 'a.txt'), 'a'),
fs.writeFile(pathFn.join(box.base, 'b', 'c.js'), 'c')
]).then(() => box.process()).then(() => {
const keys = Object.keys(data);
let key, item;

for (let i = 0, len = keys.length; i < len; i++) {
key = keys[i];
item = data[key];

item.path.should.eql(key);
item.source.should.eql(pathFn.join(box.base, key));
item.type.should.eql('create');
item.params.should.eql({});
}
}).finally(() => fs.rmdir(box.base));
});

it('process() - do nothing if target does not exist', () => {
const box = newBox('test');

return box.process();
});

it('process() - create', () => {
const box = newBox('test');
const name = 'a.txt';
const path = pathFn.join(box.base, name);

const processor = sinon.spy();
box.addProcessor(processor);

return fs.writeFile(path, 'a').then(() => box.process()).then(() => {
const file = processor.args[0][0];
file.type.should.eql('create');
file.path.should.eql(name);
}).finally(() => fs.rmdir(box.base));
});

it('process() - mtime changed', () => {
const box = newBox('test');
const name = 'a.txt';
const path = pathFn.join(box.base, name);
const cacheId = 'test/' + name;

const processor = sinon.spy();
box.addProcessor(processor);

return Promise.all([
fs.writeFile(path, 'a'),
box.Cache.insert({
_id: cacheId,
modified: 0
})
]).then(() => box.process()).then(() => {
const file = processor.args[0][0];
file.type.should.eql('update');
file.path.should.eql(name);
}).finally(() => fs.rmdir(box.base));
});

it('process() - hash changed', () => {
const box = newBox('test');
const name = 'a.txt';
const path = pathFn.join(box.base, name);
const cacheId = 'test/' + name;

const processor = sinon.spy();
box.addProcessor(processor);

return fs.writeFile(path, 'a').then(() => fs.stat(path)).then(stats => box.Cache.insert({
_id: cacheId
})).then(() => box.process()).then(() => {
const file = processor.args[0][0];
file.type.should.eql('update');
file.path.should.eql(name);
}).finally(() => fs.rmdir(box.base));
});

it('process() - skip', () => {
const box = newBox('test');
