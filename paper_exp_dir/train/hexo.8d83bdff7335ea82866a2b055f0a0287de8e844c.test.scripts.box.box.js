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

