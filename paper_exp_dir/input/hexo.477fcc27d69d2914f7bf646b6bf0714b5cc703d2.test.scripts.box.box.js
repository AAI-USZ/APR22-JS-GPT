'use strict';

const { join, sep } = require('path');
const { appendFile, mkdir, mkdirs, rename, rmdir, stat, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');
const { hash, Pattern } = require('hexo-util');
const { spy } = require('sinon');

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

