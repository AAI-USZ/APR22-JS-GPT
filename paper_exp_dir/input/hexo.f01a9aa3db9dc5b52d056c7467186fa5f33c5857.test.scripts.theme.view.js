'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var moment = require('moment');

var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'theme_test'));
var themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');

hexo.env.init = true;

return new hexo.theme.View(path, data);
}

