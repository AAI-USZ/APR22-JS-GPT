'use strict';

require('chai').should();
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('Save database', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const saveDatabase = Promise.method(require('../../../lib/plugins/filter/before_exit/save_database')).bind(hexo);
