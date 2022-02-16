'use strict';

const { writeFile, rmdir } = require('hexo-fs');
const { join } = require('path');
const yaml = require('js-yaml');
const { spy } = require('sinon');

describe('Render', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'render_test'));

hexo.config.meta_generator = false;

const body = [
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

const obj = yaml.load(body);
const path = join(hexo.base_dir, 'test.yml');

before(() => writeFile(path, body).then(() => hexo.init()));

after(() => rmdir(hexo.base_dir));

it('isRenderable()', () => {
hexo.render.isRenderable('test.txt').should.be.false;


hexo.render.isRenderable('test.htm').should.be.true;
hexo.render.isRenderable('test.html').should.be.true;


hexo.render.isRenderable('test.swig').should.be.true;


hexo.render.isRenderable('test.yml').should.be.true;
hexo.render.isRenderable('test.yaml').should.be.true;
});

it('isRenderableSync()', () => {
hexo.render.isRenderableSync('test.txt').should.be.false;


hexo.render.isRenderableSync('test.htm').should.be.true;
hexo.render.isRenderableSync('test.html').should.be.true;


hexo.render.isRenderableSync('test.swig').should.be.true;


hexo.render.isRenderableSync('test.yml').should.be.true;
hexo.render.isRenderableSync('test.yaml').should.be.true;
});

it('getOutput()', () => {
hexo.render.getOutput('test.txt').should.not.ok;


hexo.render.getOutput('test.htm').should.eql('html');
hexo.render.getOutput('test.html').should.eql('html');


hexo.render.getOutput('test.swig').should.eql('html');


hexo.render.getOutput('test.yml').should.eql('json');
hexo.render.getOutput('test.yaml').should.eql('json');
});

it('render() - path', () => hexo.render.render({path}).then(result => {
result.should.eql(obj);
}));

it('render() - text (without engine)', () => hexo.render.render({text: body}).then(result => {
result.should.eql(body);
}));

it('render() - text (with engine)', () => hexo.render.render({text: body, engine: 'yaml'}).then(result => {
result.should.eql(obj);
}));

it('render() - no path and text', () => {
const errorCallback = spy(err => {
err.should.have.property('message', 'No input file or string!');
});

return hexo.render.render().catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it('render() - options', () => hexo.render.render({
text: [
'<title>{{ title }}</title>',
'<body>{{ content }}</body>'
].join('\n'),
engine: 'swig'
}, {
title: 'Hello world',
content: 'foobar'
}).then(result => {
result.should.eql([
'<title>Hello world</title>',
'<body>foobar</body>'
].join('\n'));
}));

it('render() - toString', () => hexo.render.render({
text: body,
engine: 'yaml',
toString: true
}).then(content => {
content.should.eql(JSON.stringify(obj));
}));

it('render() - custom toString method', () => hexo.render.render({
text: body,
engine: 'yaml',
toString(data) {
return JSON.stringify(data, null, '  ');
}
}).then(content => {
content.should.eql(JSON.stringify(obj, null, '  '));
}));

it('render() - after_render filter', () => {
const data = {
text: '  <strong>123456</strong>  ',
engine: 'swig'
};

const filter = spy((result, obj) => {
result.should.eql(data.text);
obj.should.eql(data);
return result.trim();
});

hexo.extend.filter.register('after_render:html', filter);

return hexo.render.render(data).then(result => {
filter.calledOnce.should.be.true;
result.should.eql(data.text.trim());

hexo.extend.filter.unregister('after_render:html', filter);
});
});

it('render() - after_render filter: use the given output extension if not found', () => {
const data = {
text: 'foo',
engine: 'txt'
};

const filter = spy();
