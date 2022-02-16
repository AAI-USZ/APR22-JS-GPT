var should = require('chai').should();
var pathFn = require('path');
var moment = require('moment');
var Promise = require('bluebird');
var fs = require('hexo-fs');

var NEW_POST_NAME = ':title.md';

describe('new_post_path', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'new_post_path_test'));
var newPostPath = require('../../../lib/plugins/filter/new_post_path').bind(hexo);
var sourceDir = hexo.source_dir;
var draftDir = pathFn.join(sourceDir, '_drafts');
var postDir = pathFn.join(sourceDir, '_posts');

before(function(){
hexo.config.new_post_name = NEW_POST_NAME;

return fs.mkdirs(hexo.base_dir).then(function(){
return hexo.init();
});
});

after(function(){
return fs.rmdir(hexo.base_dir);
});
