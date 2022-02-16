'use strict';

const cheerio = require('cheerio');

describe('css', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
config: hexo.config
};

const css = require('../../../lib/plugins/helper/css').bind(ctx);

function assertResult(result, expected) {
const $ = cheerio.load(result);

if (!Array.isArray(expected)) {
expected = [expected];
}

expected.forEach((item, index) => {
if (typeof item === 'string' || item instanceof String) {
