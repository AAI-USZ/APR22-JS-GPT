'use strict';

var htmlTag = require('hexo-util').htmlTag;

function linkToHelper(path, text, options){

if (typeof options === 'boolean') options = {external: options};
options = options || {};

if (!text) text = path.replace(/^https?:\/\/|\/$/g, '');

var attrs = {
