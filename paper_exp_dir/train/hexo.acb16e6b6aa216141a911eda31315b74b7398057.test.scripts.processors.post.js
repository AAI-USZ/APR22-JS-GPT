const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const defaultConfig = require('../../../lib/hexo/default_config');

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const newPostName = defaultConfig.new_post_name;

describe('post', () => {
const Hexo = require('../../../lib/hexo');
const baseDir = pathFn.join(__dirname, 'post_test');
const hexo = new Hexo(baseDir);
