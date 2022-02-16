'use strict';

var swig = require('swig');
var extras = require('swig-extras');
var forTag = require('swig/lib/tags/for');

extras.useTag(swig, 'markdown');
extras.useTag(swig, 'switch');
extras.useTag(swig, 'case');

extras.useFilter(swig, 'batch');
extras.useFilter(swig, 'groupby');
