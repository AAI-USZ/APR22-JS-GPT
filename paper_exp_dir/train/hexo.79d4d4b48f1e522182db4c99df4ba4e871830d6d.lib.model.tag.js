

var _ = require('lodash'),
util = require('../util'),
escape = util.escape.path,
model = hexo.model,
config = hexo.config;



model.extend('Tag', {
