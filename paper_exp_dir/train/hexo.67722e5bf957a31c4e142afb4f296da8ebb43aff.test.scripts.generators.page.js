var should = require('chai').should();
var Promise = require('bluebird');

describe('page', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname, {silent: true});
var Page = hexo.model('Page');
var generator = Promise.method(require('../../../lib/plugins/generator/page').bind(hexo));

function locals() {
