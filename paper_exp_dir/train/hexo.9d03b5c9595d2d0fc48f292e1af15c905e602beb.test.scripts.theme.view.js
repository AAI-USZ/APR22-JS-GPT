var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var moment = require('moment');

describe('View', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'theme_test'));
var themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

function newView(path, data){
return new hexo.theme.View(path, data);
}

before(function(){
return Promise.all([
fs.mkdirs(themeDir),
fs.writeFile(hexo.config_path, 'theme: test')
]).then(function(){
return hexo.init();
}).then(function(){

hexo.theme.setView('layout.swig', [
'pre',
'{{ body }}',
'post'
].join('\n'));
});
});

after(function(){
return fs.rmdir(hexo.base_dir);
});

it('constructor', function(){
var view = newView('index.swig', {});

view.path.should.eql('index.swig');
view.source.should.eql(pathFn.join(themeDir, 'layout', 'index.swig'));
view.data.should.eql({});
});

it('parse front-matter', function(){
var body = [
'layout: false',
'---',
'content'
].join('\n');

var view = newView('index.swig', body);

view.data.should.eql({
layout: false,
_content: 'content'
});
});

it('render()', function(){
var body = [
'{{ test }}'
].join('\n');

var view = newView('index.swig', body);

return view.render({
test: 'foo'
}).then(function(content){
content.should.eql('foo');
});
});

it('render() - front-matter', function(){

var body = [
'foo: bar',
'---',
'{{ foo }}',
'{{ test }}'
].join('\n');

var view = newView('index.swig', body);

return view.render({
foo: 'foo',
test: 'test'
}).then(function(content){
content.should.eql('bar\ntest');
});
});

it('render() - helper', function(){
var body = [
'{{ date() }}'
].join('\n');

var view = newView('index.swig', body);

return view.render({
config: hexo.config,
page: {}
}).then(function(content){
content.should.eql(moment().format(hexo.config.date_format));
});
});

it('render() - layout', function(){
var body = 'content';
var view = newView('index.swig', body);

