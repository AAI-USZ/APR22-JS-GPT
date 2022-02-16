const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const sinon = require('sinon');

describe('generate', () => {
const Hexo = require('../../../lib/hexo');
const generateConsole = require('../../../lib/plugins/console/generate');
let hexo, generate;

beforeEach(() => {
