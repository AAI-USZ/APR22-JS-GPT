var should = require('chai').should();

describe('post_link', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var postLink = require('../../../lib/plugins/tag/post_link')(hexo);
var Post = hexo.model('Post');

hexo.config.permalink = ':title/';

before(() => hexo.init().then(() => Post.insert({
source: 'foo',
