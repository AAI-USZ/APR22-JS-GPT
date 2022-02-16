'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var yaml = require('js-yaml');
var sinon = require('sinon');

describe('Render', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'render_test'));
