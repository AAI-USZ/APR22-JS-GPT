'use strict';

const decache = require('decache');

describe('External link', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
let externalLink;

beforeEach(() => {
decache('../../../lib/plugins/filter/after_render/external_link');
externalLink = require('../../../lib/plugins/filter/after_render/external_link').bind(hexo);
