'use strict';

var chai = require('chai');

chai.use(require('chai-as-promised'));

describe('Hexo', function() {
require('./scripts/box');
require('./scripts/console');
require('./scripts/extend');
require('./scripts/filters');
require('./scripts/generators');
