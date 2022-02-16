var sinon = require('sinon');
var expect = require('chai').expect;

describe('Console list', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');

var listPosts = require('../../../lib/plugins/console/list/post').bind(hexo);

before(() => {
