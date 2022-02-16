'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var defaultConfig = require('../../../lib/hexo/default_config');

var dateFormat = 'YYYY-MM-DD HH:mm:ss';
var newPostName = defaultConfig.new_post_name;

describe('post', function() {
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'post_test');
var hexo = new Hexo(baseDir);
var post = require('../../../lib/plugins/processor/post')(hexo);
var process = Promise.method(post.process.bind(hexo));
var pattern = post.pattern;
var source = hexo.source;
var File = source.File;
var PostAsset = hexo.model('PostAsset');
var Post = hexo.model('Post');

function newFile(options) {
var path = options.path;

options.path = (options.published ? '_posts' : '_drafts') + '/' + path;
options.source = pathFn.join(source.base, options.path);

options.params = {
published: options.published,
path: path,
renderable: options.renderable
};

return new File(options);
}

before(function() {
return fs.mkdirs(baseDir).then(function() {
