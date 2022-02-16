var should = require('chai').should();
var fs = require('hexo-fs');
var moment = require('moment');
var pathFn = require('path');
var Promise = require('bluebird');
var sinon = require('sinon');

describe('publish', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'publish_test'), {silent: true});
