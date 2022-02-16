'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');

describe('Update package.json', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname, {silent: true});
var updatePkg = require('../../../lib/hexo/update_package');
