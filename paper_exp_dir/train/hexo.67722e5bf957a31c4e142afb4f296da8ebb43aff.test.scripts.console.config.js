var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var yaml = require('js-yaml');
var _ = require('lodash');
var rewire = require('rewire');
var sinon = require('sinon');

describe('config', () => {
var Hexo = require('../../../lib/hexo');
