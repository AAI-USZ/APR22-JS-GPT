const should = require('chai').should();
const pathFn = require('path');
const Promise = require('bluebird');
const fs = require('hexo-fs');

describe('Scaffold', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const scaffold = hexo.scaffold;
const scaffoldDir = hexo.scaffold_dir;

const testContent = [
'---',
'title: {{ title }}',
'---',
'test scaffold'
].join('\n');

const testPath = pathFn.join(scaffoldDir, 'test.md');
