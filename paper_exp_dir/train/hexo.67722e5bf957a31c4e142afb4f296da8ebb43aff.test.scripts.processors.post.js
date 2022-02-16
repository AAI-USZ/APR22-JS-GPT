var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var defaultConfig = require('../../../lib/hexo/default_config');

var dateFormat = 'YYYY-MM-DD HH:mm:ss';
var newPostName = defaultConfig.new_post_name;

describe('post', () => {
