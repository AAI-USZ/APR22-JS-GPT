'use strict';

const { join } = require('path');
const { deepMerge, full_url_for } = require('hexo-util');

describe('Page', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Page = hexo.model('Page');
const defaults = require('../../../lib/hexo/default_config');

beforeEach(() => { hexo.config = deepMerge({}, defaults); });

