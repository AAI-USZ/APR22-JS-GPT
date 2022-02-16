'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const sinon = require('sinon');

describe('generate', () => {
const Hexo = require('../../../lib/hexo');
const generateConsole = require('../../../lib/plugins/console/generate');
let hexo, generate;

beforeEach(() => {
hexo = new Hexo(pathFn.join(__dirname, 'generate_test'), {silent: true});
generate = generateConsole.bind(hexo);

return fs.mkdirs(hexo.base_dir).then(() => hexo.init());
});

afterEach(() => fs.rmdir(hexo.base_dir));

function testGenerate(options) {

return Promise.all([

fs.writeFile(pathFn.join(hexo.source_dir, 'test.txt'), 'test'),
fs.writeFile(pathFn.join(hexo.source_dir, 'faz', 'yo.txt'), 'yoooo'),

fs.writeFile(pathFn.join(hexo.public_dir, 'foo.txt'), 'foo'),
fs.writeFile(pathFn.join(hexo.public_dir, 'bar', 'boo.txt'), 'boo'),
fs.writeFile(pathFn.join(hexo.public_dir, 'faz', 'yo.txt'), 'yo')
]).then(() => generate(options)).then(() => Promise.all([
fs.readFile(pathFn.join(hexo.public_dir, 'test.txt')),
fs.readFile(pathFn.join(hexo.public_dir, 'faz', 'yo.txt')),
fs.exists(pathFn.join(hexo.public_dir, 'foo.txt')),
fs.exists(pathFn.join(hexo.public_dir, 'bar', 'boo.txt'))
])).then(result => {

result[0].should.eql('test');


result[1].should.eql('yoooo');


result[2].should.be.true;
result[3].should.be.true;
});
}

it('default', () => testGenerate());

it('write file if not exist', () => {
const src = pathFn.join(hexo.source_dir, 'test.txt');
const dest = pathFn.join(hexo.public_dir, 'test.txt');
const content = 'test';


return fs.writeFile(src, content).then(() =>
generate()).then(() =>
fs.unlink(dest)).then(() =>
generate()).then(() => fs.readFile(dest)).then(result => {
result.should.eql(content);


return Promise.all([
fs.unlink(src),
fs.unlink(dest)
]);
});
});

it('don\'t write if file unchanged', () => {
const src = pathFn.join(hexo.source_dir, 'test.txt');
const dest = pathFn.join(hexo.public_dir, 'test.txt');
const content = 'test';
const newContent = 'newtest';


return fs.writeFile(src, content).then(() =>
generate()).then(() =>
fs.writeFile(dest, newContent)).then(() =>
generate()).then(() =>
fs.readFile(dest)).then(result => {

result.should.eql(newContent);


return Promise.all([
fs.unlink(src),
fs.unlink(dest)
]);
});
});

it('force regenerate', () => {
const src = pathFn.join(hexo.source_dir, 'test.txt');
const dest = pathFn.join(hexo.public_dir, 'test.txt');
const content = 'test';
let mtime;

return fs.writeFile(src, content).then(() =>
generate()).then(() =>
fs.stat(dest)).then(stats => {
mtime = stats.mtime.getTime();
}).delay(1000).then(() =>
generate({force: true})).then(() => fs.stat(dest)).then(stats => {
stats.mtime.getTime().should.be.above(mtime);


return Promise.all([
fs.unlink(src),
fs.unlink(dest)
]);
});
});

it('watch - update', () => {
const src = pathFn.join(hexo.source_dir, 'test.txt');
const dest = pathFn.join(hexo.public_dir, 'test.txt');
const content = 'test';

return testGenerate({watch: true}).then(() =>
fs.writeFile(src, content)).delay(300).then(() => fs.readFile(dest)).then(result => {

result.should.eql(content);
}).finally(() => {

hexo.unwatch();
});
});

it('watch - delete', () => testGenerate({watch: true}).then(() => fs.unlink(pathFn.join(hexo.source_dir, 'test.txt'))).delay(300).then(() => fs.exists(pathFn.join(hexo.public_dir, 'test.txt'))).then(exist => {
exist.should.be.false;
}).finally(() => {

hexo.unwatch();
}));

it('deploy', () => {
const deployer = sinon.spy();

hexo.extend.deployer.register('test', deployer);

hexo.config.deploy = {
type: 'test'
};

return generate({deploy: true}).then(() => {
deployer.calledOnce.should.be.true;
});
});

it('update theme source files', () => Promise.all([

fs.writeFile(pathFn.join(hexo.theme_dir, 'source', 'a.txt'), 'a'),
fs.writeFile(pathFn.join(hexo.theme_dir, 'source', 'b.txt'), 'b'),
fs.writeFile(pathFn.join(hexo.theme_dir, 'source', 'c.swig'), 'c')
]).then(() => generate()).then(() =>
Promise.all([
fs.writeFile(pathFn.join(hexo.theme_dir, 'source', 'b.txt'), 'bb'),
fs.writeFile(pathFn.join(hexo.theme_dir, 'source', 'c.swig'), 'cc')
])).then(() =>
generate()).then(() =>
Promise.all([
fs.readFile(pathFn.join(hexo.public_dir, 'b.txt')),
fs.readFile(pathFn.join(hexo.public_dir, 'c.html'))
])).then(result => {
result[0].should.eql('bb');
result[1].should.eql('cc');
}));

it('proceeds after error when bail option is not set', () => {
hexo.extend.renderer.register('err', 'html', () => Promise.reject(new Error('Testing unhandled exception')));
hexo.extend.generator.register('test_page', () =>
[
{
path: 'testing-path',
layout: 'post',
data: {}
}
]
);

return Promise.all([
fs.writeFile(pathFn.join(hexo.theme_dir, 'layout', 'post.err'), 'post')
]).then(() => {
return generate();
});
});

it('proceeds after error when bail option is set to false', () => {
hexo.extend.renderer.register('err', 'html', () => Promise.reject(new Error('Testing unhandled exception')));
hexo.extend.generator.register('test_page', () =>
[
{
path: 'testing-path',
layout: 'post',
data: {}
}
]
);

return Promise.all([
fs.writeFile(pathFn.join(hexo.theme_dir, 'layout', 'post.err'), 'post')
]).then(() => {
return generate({bail: false});
});
});

it('breaks after error when bail option is set to true', () => {
hexo.extend.renderer.register('err', 'html', () => Promise.reject(new Error('Testing unhandled exception')));
hexo.extend.generator.register('test_page', () =>
[
{
path: 'testing-path',
layout: 'post',
data: {}
}
]
);

const errorCallback = sinon.spy(err => {
err.should.have.property('message', 'Testing unhandled exception');
});

return Promise.all([
fs.writeFile(pathFn.join(hexo.theme_dir, 'layout', 'post.err'), 'post')
]).then(() => {
return generate({bail: true}).catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});
});

