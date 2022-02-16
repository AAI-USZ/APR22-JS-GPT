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


hexo.render.isRenderable('test.swig').should.be.false;
hexo.render.isRenderable('test.njk').should.be.true;


hexo.render.isRenderable('test.yml').should.be.true;
hexo.render.isRenderable('test.yaml').should.be.true;
});

it('isRenderableSync()', () => {
hexo.render.isRenderableSync('test.txt').should.be.false;


hexo.render.isRenderableSync('test.htm').should.be.true;
hexo.render.isRenderableSync('test.html').should.be.true;


hexo.render.isRenderableSync('test.swig').should.be.false;
hexo.render.isRenderableSync('test.njk').should.be.true;


hexo.render.isRenderableSync('test.yml').should.be.true;
hexo.render.isRenderableSync('test.yaml').should.be.true;
});

it('getOutput()', () => {
hexo.render.getOutput('test.txt').should.not.ok;


hexo.render.getOutput('test.htm').should.eql('html');
hexo.render.getOutput('test.html').should.eql('html');


hexo.render.getOutput('test.njk').should.eql('html');


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
return hexo.render.render().then(() => {
should.fail('Return value must be rejected');
}, err => {
err.should.property('message', 'No input file or string!');
});
});

it('render() - options', () => hexo.render.render({
text: [
'<title>{{ title }}</title>',
'<body>{{ content }}</body>'
].join('\n'),
engine: 'njk'
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

it.skip('render() - after_render filter', () => {
const data = {
text: '  <strong>123456</strong>  ',
engine: 'njk'
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
hexo.extend.filter.register('after_render:txt', filter);

return hexo.render.render(data).then(result => {
filter.calledOnce.should.be.true;
hexo.extend.filter.unregister('after_render:txt', filter);
});
});

it('render() - onRenderEnd method', () => {
const onRenderEnd = spy(result => result + 'bar');

const data = {
text: 'foo',
engine: 'txt',
onRenderEnd
};

const filter = spy();

hexo.extend.filter.register('after_render:txt', filter);

return hexo.render.render(data).then(result => {
onRenderEnd.calledOnce.should.be.true;
filter.calledOnce.should.be.true;
filter.calledWith('foobar').should.be.true;

hexo.extend.filter.unregister('after_render:txt', filter);
});
});

it('renderSync() - path', () => {
const result = hexo.render.renderSync({path});
result.should.eql(obj);
});

it('renderSync() - text (without engine)', () => {
const result = hexo.render.renderSync({text: body});
result.should.eql(body);
});

it('renderSync() - text (with engine)', () => {
const result = hexo.render.renderSync({text: body, engine: 'yaml'});
result.should.eql(obj);
});

it('renderSync() - no path and text', () => {
should.throw(() => hexo.render.renderSync(), 'No input file or string!');
});

it('renderSync() - options', () => {
const result = hexo.render.renderSync({
text: [
'<title>{{ title }}</title>',
'<body>{{ content }}</body>'
].join('\n'),
engine: 'njk'
}, {
title: 'Hello world',
content: 'foobar'
});

result.should.eql([
'<title>Hello world</title>',
'<body>foobar</body>'
].join('\n'));
});

it('renderSync() - toString', () => {
const result = hexo.render.renderSync({
text: body,
engine: 'yaml',
toString: true
});

result.should.eql(JSON.stringify(obj));
});

it('renderSync() - custom toString method', () => {
const result = hexo.render.renderSync({
text: body,
engine: 'yaml',
toString(data) {
return JSON.stringify(data, null, '  ');
}
});

result.should.eql(JSON.stringify(obj, null, '  '));
});

it.skip('renderSync() - after_render filter', () => {
const data = {
text: '  <strong>123456</strong>  ',
engine: 'njk'
};

const filter = spy(result => result.trim());

hexo.extend.filter.register('after_render:html', filter);

const result = hexo.render.renderSync(data);

filter.calledOnce.should.be.true;
filter.calledWith(data.text, data).should.be.true;
result.should.eql(data.text.trim());

hexo.extend.filter.unregister('after_render:html', filter);
});

it('renderSync() - after_render filter: use the given output extension if not found', () => {
const data = {
text: 'foo',
engine: 'txt'
};

const filter = spy();
hexo.extend.filter.register('after_render:txt', filter);

hexo.render.renderSync(data);
filter.calledOnce.should.be.true;
hexo.extend.filter.unregister('after_render:txt', filter);
});

it('renderSync() - onRenderEnd', () => {
const onRenderEnd = spy(result => result + 'bar');

const data = {
text: 'foo',
engine: 'txt',
onRenderEnd
};

const filter = spy(result => {
result.should.eql('foobar');
});

hexo.extend.filter.register('after_render:txt', filter);

hexo.render.renderSync(data);
onRenderEnd.calledOnce.should.be.true;
filter.calledOnce.should.be.true;

hexo.extend.filter.unregister('after_render:txt', filter);
});
});
