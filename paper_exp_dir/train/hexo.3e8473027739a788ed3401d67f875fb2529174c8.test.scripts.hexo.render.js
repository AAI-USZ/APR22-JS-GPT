'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var yaml = require('js-yaml');
var sinon = require('sinon');

describe('Render', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'render_test'));

var body = [
'name:',
'  first: John',
'  last: Doe',
'',
'age: 23',
'',
'list:',
'- Apple',
'- Banana'
].join('\n');

var obj = yaml.load(body);
var path = pathFn.join(hexo.base_dir, 'test.yml');

before(function(){
return fs.writeFile(path, body).then(function(){
return hexo.init();
});
});

after(function(){
return fs.rmdir(hexo.base_dir);
});

it('isRenderable()', function(){
hexo.render.isRenderable('test.txt').should.be.false;


hexo.render.isRenderable('test.htm').should.be.true;
hexo.render.isRenderable('test.html').should.be.true;


hexo.render.isRenderable('test.swig').should.be.true;


hexo.render.isRenderable('test.yml').should.be.true;
hexo.render.isRenderable('test.yaml').should.be.true;
});

it('isRenderableSync()', function(){
hexo.render.isRenderableSync('test.txt').should.be.false;


hexo.render.isRenderableSync('test.htm').should.be.true;
hexo.render.isRenderableSync('test.html').should.be.true;


hexo.render.isRenderableSync('test.swig').should.be.true;


hexo.render.isRenderableSync('test.yml').should.be.true;
hexo.render.isRenderableSync('test.yaml').should.be.true;
});

it('getOutput()', function(){
hexo.render.getOutput('test.txt').should.not.ok;


hexo.render.getOutput('test.htm').should.eql('html');
hexo.render.getOutput('test.html').should.eql('html');


hexo.render.getOutput('test.swig').should.eql('html');


hexo.render.getOutput('test.yml').should.eql('json');
hexo.render.getOutput('test.yaml').should.eql('json');
});

it('render() - path', function(){
return hexo.render.render({path: path}).then(function(result){
result.should.eql(obj);
});
});

it('render() - text (without engine)', function(){
return hexo.render.render({text: body}).then(function(result){
result.should.eql(body);
});
});

it('render() - text (with engine)', function(){
return hexo.render.render({text: body, engine: 'yaml'}).then(function(result){
result.should.eql(obj);
});
});

it('render() - no path and text', function(){
var errorCallback = sinon.spy(function(err){
err.should.have.property('message', 'No input file or string!');
})

return hexo.render.render().catch(errorCallback).finally(function() {
errorCallback.calledOnce.should.be.true;
});
});

it('render() - options', function(){
return hexo.render.render({
