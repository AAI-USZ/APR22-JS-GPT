'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');

describe('Load database', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'db_test'), {silent: true});
const loadDatabase = require('../../../lib/hexo/load_database');
const dbPath = hexo.database.options.path;

const fixture = {
