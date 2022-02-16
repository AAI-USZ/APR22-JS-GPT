var should = require('chai').should();
var fs = require('hexo-fs');
var Promise = require('bluebird');

describe('Save database', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var saveDatabase = Promise.method(require('../../../lib/plugins/filter/before_exit/save_database')).bind(hexo);
var dbPath = hexo.database.options.path;

