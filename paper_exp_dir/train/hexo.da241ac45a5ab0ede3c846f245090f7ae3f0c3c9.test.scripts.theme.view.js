'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var moment = require('moment');

describe('View', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'theme_test'));
var themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

hexo.env.init = true;

function newView(path, data) {
return new hexo.theme.View(path, data);
}

before(function() {
return Promise.all([
fs.mkdirs(themeDir),
fs.writeFile(hexo.config_path, 'theme: test')
]).then(function() {
return hexo.init();
}).then(function() {

hexo.theme.setView('layout.swig', [
'pre',
'{{ body }}',
'post'
].join('\n'));
});
});

after(function() {
return fs.rmdir(hexo.base_dir);
});

it('constructor', function() {
var data = {
_content: ''
};
var view = newView('index.swig', data);

view.path.should.eql('index.swig');
view.source.should.eql(pathFn.join(themeDir, 'layout', 'index.swig'));
view.data.should.eql(data);
});

