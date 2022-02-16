'use strict';

var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var sinon = require('sinon');

describe('deploy', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'deploy_test'), {silent: true});
