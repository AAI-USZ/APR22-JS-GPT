const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const moment = require('moment');
const sinon = require('sinon');

describe('View', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'theme_test'));
const themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

hexo.env.init = true;

function newView(path, data) {
return new hexo.theme.View(path, data);
}

before(() => Promise.all([
fs.mkdirs(themeDir),
fs.writeFile(hexo.config_path, 'theme: test')
]).then(() => hexo.init()).then(() => {

hexo.theme.setView('layout.swig', [
'pre',
'{{ body }}',
'post'
].join('\n'));
}));

after(() => fs.rmdir(hexo.base_dir));

it('constructor', () => {
const data = {
