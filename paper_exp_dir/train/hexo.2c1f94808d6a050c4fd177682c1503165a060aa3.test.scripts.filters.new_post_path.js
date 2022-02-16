'use strict';

var should = require('chai').should();
var assert = require('chai').assert;
var pathFn = require('path');
var moment = require('moment');
var Promise = require('bluebird');
var fs = require('hexo-fs');

var NEW_POST_NAME = ':title.md';

describe('new_post_path', function(){
var Hexo = require('../../../lib/hexo');
