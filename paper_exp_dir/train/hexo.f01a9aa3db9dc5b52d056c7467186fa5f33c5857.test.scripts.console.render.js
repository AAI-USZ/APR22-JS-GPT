'use strict';

var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');

describe('render', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'render_test'), {silent: true});
var render = require('../../../lib/plugins/console/render').bind(hexo);

before(function() {
return fs.mkdirs(hexo.base_dir).then(function() {
return hexo.init();
});
});

after(function() {
return fs.rmdir(hexo.base_dir);
});

var body = [
'foo: 1',
'bar:',
'  boo: 2'
].join('\n');

it('relative path', function() {
var src = pathFn.join(hexo.base_dir, 'test.yml');
var dest = pathFn.join(hexo.base_dir, 'result.json');

return fs.writeFile(src, body).then(function() {
return render({_: ['test.yml'], output: 'result.json'});
}).then(function() {
return fs.readFile(dest);
}).then(function(result) {
JSON.parse(result).should.eql({
foo: 1,
bar: {
boo: 2
}
});

return Promise.all([
fs.unlink(src),
fs.unlink(dest)
]);
});
});

it('absolute path', function() {
var src = pathFn.join(hexo.base_dir, 'test.yml');
var dest = pathFn.join(hexo.base_dir, 'result.json');

return fs.writeFile(src, body).then(function() {
