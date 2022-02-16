var should = require('chai').should();
var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var yaml = require('js-yaml');
var _ = require('lodash');

describe('File', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
