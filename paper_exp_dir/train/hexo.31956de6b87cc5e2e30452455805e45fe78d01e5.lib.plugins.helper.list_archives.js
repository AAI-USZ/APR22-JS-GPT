'use strict';

function listArchivesHelper(options){

options = options || {};

var config = this.config;
var archiveDir = config.archive_dir;
var timezone = config.timezone;
var lang = this.page.lang || this.page.language || config.language;
var format = options.format;
var type = options.type || 'monthly';
var style = options.hasOwnProperty('style') ? options.style : 'list';
var showCount = options.hasOwnProperty('show_count') ? options.show_count : true;
var transform = options.transform;
var separator = options.hasOwnProperty('separator') ? options.separator : ', ';
