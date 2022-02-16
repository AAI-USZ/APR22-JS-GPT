var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');

describe('Load database', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'db_test'), {silent: true});
var loadDatabase = require('../../../lib/hexo/load_database');
var dbPath = hexo.database.options.path;

