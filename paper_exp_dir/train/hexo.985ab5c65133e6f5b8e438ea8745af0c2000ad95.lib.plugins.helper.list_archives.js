'use strict';

function listArchivesHelper(options = {}) {
const config = this.config;
const archiveDir = config.archive_dir;
const timezone = config.timezone;
const lang = this.page.lang || this.page.language || config.language;
let format = options.format;
const type = options.type || 'monthly';
const style = options.hasOwnProperty('style') ? options.style : 'list';
const showCount = options.hasOwnProperty('show_count') ? options.show_count : true;
const transform = options.transform;
const separator = options.hasOwnProperty('separator') ? options.separator : ', ';
const className = options.class || 'archive';
const order = options.order || -1;
let result = '';

if (!format) {
format = type === 'monthly' ? 'MMMM YYYY' : 'YYYY';
}

const posts = this.site.posts.sort('date', order);
if (!posts.length) return result;

const data = [];
let length = 0;
