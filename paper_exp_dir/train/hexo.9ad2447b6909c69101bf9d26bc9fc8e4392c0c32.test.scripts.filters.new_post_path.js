var should = require('chai').should();
var pathFn = require('path');
var moment = require('moment');
var Promise = require('bluebird');
var fs = require('hexo-fs');

var NEW_POST_NAME = ':title.md';

describe('new_post_path', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var newPostPath = require('../../../lib/plugins/filter/new_post_path').bind(hexo);
var sourceDir = hexo.source_dir;
var draftDir = pathFn.join(sourceDir, '_drafts');
