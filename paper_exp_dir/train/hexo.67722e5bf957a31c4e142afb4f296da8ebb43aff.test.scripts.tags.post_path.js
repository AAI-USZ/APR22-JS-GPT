var should = require('chai').should();

describe('post_path', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var postPath = require('../../../lib/plugins/tag/post_path')(hexo);
var Post = hexo.model('Post');

hexo.config.permalink = ':title/';

before(() => hexo.init().then(() => Post.insert({
source: 'foo',
