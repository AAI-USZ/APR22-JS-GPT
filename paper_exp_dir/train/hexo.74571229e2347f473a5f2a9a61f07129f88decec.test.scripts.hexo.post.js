'use strict';

var should = require('chai').should();
var pathFn = require('path');
var moment = require('moment');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var util = require('hexo-util');
var sinon = require('sinon');
var fixture = require('../../fixtures/post_render');
