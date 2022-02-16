'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');
var sep = pathFn.sep;
var testUtil = require('../../util');

describe('Hexo', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'hexo_test'), {silent: true});
var coreDir = pathFn.join(__dirname, '../../..');
var version = require('../../../package.json').version;
var Post = hexo.model('Post');
var Page = hexo.model('Page');
var Data = hexo.model('Data');
var route = hexo.route;

function checkStream(stream, expected){
return testUtil.stream.read(stream).then(function(data){
data.should.eql(expected);
});
}

function loadAssetGenerator(){
hexo.extend.generator.register('asset', require('../../../lib/plugins/generator/asset'));
}

before(function(){
return fs.mkdirs(hexo.base_dir).then(function(){
return hexo.init();
});
});

beforeEach(function(){

hexo.extend.generator.store = {};

route.routes = {};
});

after(function(){
return fs.rmdir(hexo.base_dir);
});

hexo.extend.console.register('test', function(args){
return args;
});

it('constructor', function(){
var hexo = new Hexo(__dirname);

hexo.core_dir.should.eql(coreDir + sep);
hexo.lib_dir.should.eql(pathFn.join(coreDir, 'lib') + sep);
hexo.version.should.eql(version);
hexo.base_dir.should.eql(__dirname + sep);
hexo.public_dir.should.eql(pathFn.join(__dirname, 'public') + sep);
hexo.source_dir.should.eql(pathFn.join(__dirname, 'source') + sep);
hexo.plugin_dir.should.eql(pathFn.join(__dirname, 'node_modules') + sep);
hexo.script_dir.should.eql(pathFn.join(__dirname, 'scripts') + sep);
hexo.scaffold_dir.should.eql(pathFn.join(__dirname, 'scaffolds') + sep);
hexo.env.should.eql({
args: {},
debug: false,
safe: false,
silent: false,
env: process.env.NODE_ENV || 'development',
version: version,
init: false
});
hexo.config_path.should.eql(pathFn.join(__dirname, '_config.yml'));
});

it('call()', function(){
return hexo.call('test', {foo: 'bar'}).then(function(data){
data.should.eql({foo: 'bar'});
});
});

it('call() - callback', function(callback){
hexo.call('test', {foo: 'bar'}, function(err, data){
should.not.exist(err);
data.should.eql({foo: 'bar'});

callback();
});
});

it('call() - console not registered', function(){
return hexo.call('nothing').catch(function(err){
err.should.have.property('message', 'Console `nothing` has not been registered yet!');
});
});

it('init()', function(){
var hexo = new Hexo(pathFn.join(__dirname, 'hexo_test'), {silent: true});
var hook = sinon.spy();

hexo.extend.filter.register('after_init', hook);

return hexo.init().then(function(){
hook.calledOnce.should.be.true;
});
});

it('model()');

it('_showDrafts()', function(){
hexo._showDrafts().should.be.false;

hexo.env.args.draft = true;
hexo._showDrafts().should.be.true;
hexo.env.args.draft = false;

hexo.env.args.drafts = true;
hexo._showDrafts().should.be.true;
hexo.env.args.drafts = false;

hexo.config.render_drafts = true;
hexo._showDrafts().should.be.true;
hexo.config.render_drafts = false;
});

function testLoad(path){
var target = pathFn.join(path, 'test.txt');
var body = 'test';

loadAssetGenerator();

return fs.writeFile(target, body).then(function(){
return hexo.load();
}).then(function(){
return checkStream(route.get('test.txt'), body);
}).then(function(){
return fs.unlink(target);
});
}

it('load() - source', function(){
return testLoad(hexo.source_dir);
});

it('load() - theme', function(){
return testLoad(pathFn.join(hexo.theme_dir, 'source'));
});

function testWatch(path){
var target = pathFn.join(path, 'test.txt');
var body = 'test';
var newBody = body + body;

loadAssetGenerator();

return fs.writeFile(target, body).then(function(){
return hexo.watch();
}).then(function(){

return checkStream(route.get('test.txt'), body);
}).then(function(){

return fs.writeFile(target, newBody);
}).delay(300).then(function(){

return checkStream(route.get('test.txt'), newBody);
}).then(function(){

return hexo.unwatch();
}).then(function(){

return fs.unlink(target);
});
}

it('watch() - source', function(){
return testWatch(hexo.source_dir);
});
