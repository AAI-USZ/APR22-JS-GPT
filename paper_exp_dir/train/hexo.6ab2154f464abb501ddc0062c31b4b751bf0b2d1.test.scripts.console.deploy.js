var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');

describe('deploy', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'deploy_test'), {silent: true});
var deploy = require('../../../lib/plugins/console/deploy').bind(hexo);

before(function(){
return fs.mkdirs(hexo.public_dir).then(function(){
return hexo.init();
});
});

after(function(){
return fs.rmdir(hexo.base_dir);
});

it('single deploy setting', function(){
