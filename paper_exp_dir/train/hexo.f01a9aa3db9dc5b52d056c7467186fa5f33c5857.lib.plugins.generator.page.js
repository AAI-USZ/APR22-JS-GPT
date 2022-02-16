'use strict';

var minimatch = require('minimatch');
var _ = require('lodash');

function pageGenerator(locals) {
var skipRender = this.config.skip_render || [];
if (!Array.isArray(skipRender)) skipRender = [skipRender];
skipRender = _.compact(skipRender);

var skipRenderLen = skipRender.length;

function isSkipRender(path) {
if (!skipRenderLen) return false;

