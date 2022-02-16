var should = require('chai').should();
var moment = require('moment');

var PERMALINK = ':year/:month/:day/:title/';

describe('post_permalink', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var postPermalink = require('../../../lib/plugins/filter/post_permalink').bind(hexo);
var Post = hexo.model('Post');
var post;
