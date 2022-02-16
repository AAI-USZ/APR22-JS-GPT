'use strict';

require('chai').should();
const util = require('hexo-util');
const _ = require('lodash');
const defaultConfig = require('../../../lib/hexo/default_config');

describe('Backtick code block', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
