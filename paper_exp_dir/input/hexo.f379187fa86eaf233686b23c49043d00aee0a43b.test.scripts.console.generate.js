'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');

describe('generate', function() {
var Hexo = require('../../../lib/hexo');
var generateConsole = require('../../../lib/plugins/console/generate');
var hexo, generate;

beforeEach(function() {
hexo = new Hexo(pathFn.join(__dirname, 'generate_test'), {silent: true});
generate = generateConsole.bind(hexo);

return fs.mkdirs(hexo.base_dir).then(function() {
return hexo.init();
});
});

afterEach(function() {
return fs.rmdir(hexo.base_dir);
});

function testGenerate(options) {
options = options || {};

return Promise.all([

fs.writeFile(pathFn.join(hexo.source_dir, 'test.txt'), 'test'),
fs.writeFile(pathFn.join(hexo.source_dir, 'faz', 'yo.txt'), 'yoooo'),

fs.writeFile(pathFn.join(hexo.public_dir, 'foo.txt'), 'foo'),
fs.writeFile(pathFn.join(hexo.public_dir, 'bar', 'boo.txt'), 'boo'),
fs.writeFile(pathFn.join(hexo.public_dir, 'faz', 'yo.txt'), 'yo')
]).then(function() {
return generate(options);
}).then(function() {
return Promise.all([
fs.readFile(pathFn.join(hexo.public_dir, 'test.txt')),
fs.readFile(pathFn.join(hexo.public_dir, 'faz', 'yo.txt')),
fs.exists(pathFn.join(hexo.public_dir, 'foo.txt')),
fs.exists(pathFn.join(hexo.public_dir, 'bar', 'boo.txt'))
]);
}).then(function(result) {

result[0].should.eql('test');


result[1].should.eql('yoooo');


});
}

it('default', function() {
return testGenerate();
});

it('write file if not exist', function() {
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';


return fs.writeFile(src, content).then(function() {

return generate({});
}).then(function() {

return fs.unlink(dest);
}).then(function() {

return generate({});
}).then(function() {
return fs.readFile(dest);
}).then(function(result) {
result.should.eql(content);


return Promise.all([
fs.unlink(src),
fs.unlink(dest)
]);
});
});

it('don\'t write if file unchanged', function() {
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';
var newContent = 'newtest';


return fs.writeFile(src, content).then(function() {

return generate({});
}).then(function() {

return fs.writeFile(dest, newContent);
}).then(function() {

return generate({});
}).then(function() {

return fs.readFile(dest);
}).then(function(result) {

result.should.eql(newContent);


return Promise.all([
fs.unlink(src),
fs.unlink(dest)
]);
});
});

it('force regenerate', function() {
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';
var mtime;

return fs.writeFile(src, content).then(function() {

return generate({});
}).then(function() {

return fs.stat(dest);
}).then(function(stats) {
mtime = stats.mtime.getTime();
}).delay(1000).then(function() {

return generate({force: true});
}).then(function() {
return fs.stat(dest);
}).then(function(stats) {
stats.mtime.getTime().should.be.above(mtime);


return Promise.all([
fs.unlink(src),
fs.unlink(dest)
]);
});
});

it('watch - update', function() {
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';

return testGenerate({watch: true}).then(function() {

return fs.writeFile(src, content);
}).delay(300).then(function() {
return fs.readFile(dest);
}).then(function(result) {

result.should.eql(content);
}).finally(function() {

hexo.unwatch();
});
});

it('watch - delete', function() {
return testGenerate({watch: true}).then(function() {
return fs.unlink(pathFn.join(hexo.source_dir, 'test.txt'));
}).delay(300).then(function() {
return fs.exists(pathFn.join(hexo.public_dir, 'test.txt'));
}).then(function(exist) {
exist.should.be.false;
}).finally(function() {

hexo.unwatch();
});
});

it('deploy', function() {
var deployer = sinon.spy();

hexo.extend.deployer.register('test', deployer);

hexo.config.deploy = {
type: 'test'
};

return generate({deploy: true}).then(function() {
deployer.calledOnce.should.be.true;
});
});

it('update theme source files', function() {
return Promise.all([

fs.writeFile(pathFn.join(hexo.theme_dir, 'source', 'a.txt'), 'a'),
fs.writeFile(pathFn.join(hexo.theme_dir, 'source', 'b.txt'), 'b'),
fs.writeFile(pathFn.join(hexo.theme_dir, 'source', 'c.swig'), 'c')
]).then(function() {
return generate({});
}).then(function() {

return Promise.all([
fs.writeFile(pathFn.join(hexo.theme_dir, 'source', 'b.txt'), 'bb'),
fs.writeFile(pathFn.join(hexo.theme_dir, 'source', 'c.swig'), 'cc')
]);
}).then(function() {

return generate({});
}).then(function() {

return Promise.all([
fs.readFile(pathFn.join(hexo.public_dir, 'b.txt')),
fs.readFile(pathFn.join(hexo.public_dir, 'c.html'))
]);
}).then(function(result) {
result[0].should.eql('bb');
result[1].should.eql('cc');
});
});
});
