var sinon = require('sinon');
var expect = require('chai').expect;

describe('Console list', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Page = hexo.model('Page');
var listPages = require('../../../lib/plugins/console/list/page').bind(hexo);

hexo.config.permalink = ':title/';
