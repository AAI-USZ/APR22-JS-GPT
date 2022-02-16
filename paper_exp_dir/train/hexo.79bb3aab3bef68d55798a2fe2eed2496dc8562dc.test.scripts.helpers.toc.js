'use strict';

const { encodeURL, escapeHTML } = require('hexo-util');

describe('toc', () => {
const toc = require('../../../lib/plugins/helper/toc');

const html = [
'<h1 id="title_1">Title 1</h1>',
'<h2 id="title_1_1">Title 1.1</h2>',
'<h3 id="title_1_1_1">Title 1.1.1</h3>',
'<h2 id="title_1_2">Title 1.2</h2>',
