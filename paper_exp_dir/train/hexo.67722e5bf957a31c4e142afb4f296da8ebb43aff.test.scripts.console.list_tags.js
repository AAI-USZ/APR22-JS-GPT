var Promise = require('bluebird');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Console list', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Post = hexo.model('Post');

var listTags = require('../../../lib/plugins/console/list/tag').bind(hexo);
