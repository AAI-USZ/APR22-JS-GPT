var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');

describe('generate', () => {
var Hexo = require('../../../lib/hexo');
var generateConsole = require('../../../lib/plugins/console/generate');
var hexo;
var generate;

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
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';


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
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';
var newContent = 'newtest';


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
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';
var mtime;

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
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';

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
var deployer = sinon.spy();

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

