'use strict';

var should = require('chai').should();
var _ = require('lodash');

describe('toc', function(){
var toc = require('../../../lib/plugins/helper/toc');

var html = [
'<h1 id="title_1">Title 1</h1>',
