'use strict';

function listArchivesHelper(options){

options = options || {};

var archiveDir = this.config.archive_dir;
var format = options.format;
var type = options.type || 'monthly';
var style = options.hasOwnProperty('style') ? options.style : 'list';
