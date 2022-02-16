var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');
var sep = pathFn.sep;
var testUtil = require('../../util');

describe('Hexo', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'hexo_test'), {silent: true});
var coreDir = pathFn.join(__dirname, '../../..');
var version = require('../../../package.json').version;
var Post = hexo.model('Post');
