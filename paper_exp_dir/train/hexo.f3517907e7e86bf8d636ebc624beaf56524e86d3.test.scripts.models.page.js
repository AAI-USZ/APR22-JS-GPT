const should = require('chai').should();
const sinon = require('sinon');
const pathFn = require('path');

describe('Page', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Page = hexo.model('Page');

it('default values', () => {
const now = Date.now();

return Page.insert({
source: 'foo',
path: 'bar'
}).then(data => {
data.title.should.eql('');
data.date.valueOf().should.gte(now);
data.updated.valueOf().should.gte(now);
data.comments.should.be.true;
data.layout.should.eql('page');
data._content.should.eql('');
data.raw.should.eql('');
should.not.exist(data.content);
should.not.exist(data.excerpt);
should.not.exist(data.more);

return Page.removeById(data._id);
});
});

it('source - required', () => {
const errorCallback = sinon.spy(err => {
err.should.have.property('message', '`source` is required!');
});

return Page.insert({}).catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it('path - required', () => {
const errorCallback = sinon.spy(err => {
err.should.have.property('message', '`path` is required!');
});

return Page.insert({
source: 'foo'
}).catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it('permalink - virtual', () => Page.insert({
source: 'foo',
path: 'bar'
}).then(data => {
data.permalink.should.eql(hexo.config.url + '/' + data.path);
return Page.removeById(data._id);
}));

it('full_source - virtual', () => Page.insert({
source: 'foo',
path: 'bar'
}).then(data => {
data.full_source.should.eql(pathFn.join(hexo.source_dir, data.source));
return Page.removeById(data._id);
}));
});
