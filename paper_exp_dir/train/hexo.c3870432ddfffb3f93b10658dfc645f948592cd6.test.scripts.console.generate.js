'use strict';

const { join } = require('path');
const { emptyDir, exists, mkdirs, readFile, rmdir, stat, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');
const { spy } = require('sinon');

describe('generate', () => {
const Hexo = require('../../../lib/hexo');
const generateConsole = require('../../../lib/plugins/console/generate');
let hexo, generate;

beforeEach(async () => {
hexo = new Hexo(join(__dirname, 'generate_test'), {silent: true});
generate = generateConsole.bind(hexo);

await mkdirs(hexo.base_dir);
await hexo.init();
});

afterEach(async () => {
const exist = await exists(hexo.base_dir);
if (exist) {
await emptyDir(hexo.base_dir);
await rmdir(hexo.base_dir);
}
});

const testGenerate = async options => {
await Promise.all([

writeFile(join(hexo.source_dir, 'test.txt'), 'test'),
writeFile(join(hexo.source_dir, 'faz', 'yo.txt'), 'yoooo'),

writeFile(join(hexo.public_dir, 'foo.txt'), 'foo'),
writeFile(join(hexo.public_dir, 'bar', 'boo.txt'), 'boo'),
writeFile(join(hexo.public_dir, 'faz', 'yo.txt'), 'yo')
]);
await generate(options);

const result = await Promise.all([
readFile(join(hexo.public_dir, 'test.txt')),
readFile(join(hexo.public_dir, 'faz', 'yo.txt')),
exists(join(hexo.public_dir, 'foo.txt')),
exists(join(hexo.public_dir, 'bar', 'boo.txt'))
]);

result[0].should.eql('test');

result[1].should.eql('yoooo');

result[2].should.be.true;
result[3].should.be.true;
};

it('default', () => testGenerate());

it('write file if not exist', async () => {
const src = join(hexo.source_dir, 'test.txt');
const dest = join(hexo.public_dir, 'test.txt');
const content = 'test';


await writeFile(src, content);


await generate();


await unlink(dest);


await generate();

const result = await readFile(dest);

result.should.eql(content);


await Promise.all([
unlink(src),
unlink(dest)
]);
});

it('don\'t write if file unchanged', async () => {
const src = join(hexo.source_dir, 'test.txt');
const dest = join(hexo.public_dir, 'test.txt');
const content = 'test';
const newContent = 'newtest';


await writeFile(src, content);


await generate();


await writeFile(dest, newContent);


await generate();


const result = await readFile(dest);


result.should.eql(newContent);


await Promise.all([
unlink(src),
unlink(dest)
]);
});

it('force regenerate', async () => {
const src = join(hexo.source_dir, 'test.txt');
const dest = join(hexo.public_dir, 'test.txt');
const content = 'test';

await writeFile(src, content);


await generate();


let stats = await stat(dest);
const mtime = stats.mtime.getTime();

await Promise.delay(1000);


await generate({ force: true });
stats = await stat(dest);

stats.mtime.getTime().should.above(mtime);


await Promise.all([
unlink(src),
unlink(dest)
]);
});

it('watch - update', async () => {
const src = join(hexo.source_dir, 'test.txt');
const dest = join(hexo.public_dir, 'test.txt');
const content = 'test';

await testGenerate({ watch: true });


await writeFile(src, content);

await Promise.delay(300);


const result = await readFile(dest);
result.should.eql(content);


await hexo.unwatch();
});

it('deploy', async () => {
const deployer = spy();

hexo.extend.deployer.register('test', deployer);

hexo.config.deploy = {
type: 'test'
};

await generate({ deploy: true });

deployer.calledOnce.should.be.true;
});

it('update theme source files', async () => {

await Promise.all([

writeFile(join(hexo.theme_dir, 'source', 'a.txt'), 'a'),
writeFile(join(hexo.theme_dir, 'source', 'b.txt'), 'b'),
writeFile(join(hexo.theme_dir, 'source', 'c.njk'), 'c')
]);
await generate();


await Promise.all([
writeFile(join(hexo.theme_dir, 'source', 'b.txt'), 'bb'),
writeFile(join(hexo.theme_dir, 'source', 'c.njk'), 'cc')
]);


await generate();

await Promise.delay(300);


const result = await Promise.all([
readFile(join(hexo.public_dir, 'b.txt')),
readFile(join(hexo.public_dir, 'c.html'))
]);

result[0].should.eql('bb');
result[1].should.eql('cc');
});

it('proceeds after error when bail option is not set', async () => {
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

await writeFile(join(hexo.theme_dir, 'layout', 'post.err'), 'post');
return generate();
});

it('proceeds after error when bail option is set to false', async () => {
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

await writeFile(join(hexo.theme_dir, 'layout', 'post.err'), 'post');
return generate({ bail: false });
});

it('breaks after error when bail option is set to true', async () => {
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

await writeFile(join(hexo.theme_dir, 'layout', 'post.err'), 'post');

return generate({ bail: true }).then(() => {
should.fail('Return value must be rejected');
}, err => {
err.should.property('message', 'Testing unhandled exception');
});
});

it('should generate all files when bail option is set to true and no errors', async () => {

hexo.extend.generator.register('resource', () =>
[
{
path: 'resource-1',
data: 'string'
},
{
path: 'resource-2',
