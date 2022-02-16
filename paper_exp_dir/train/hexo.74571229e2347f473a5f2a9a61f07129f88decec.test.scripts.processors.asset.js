'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');

var dateFormat = 'YYYY-MM-DD HH:mm:ss';

describe('asset', function(){
var Hexo = require('../../../lib/hexo');
