'use strict';

const chalk = require('chalk');
const table = require('text-table');
const common = require('./common');

function listPage() {
const Page = this.model('Page');

const data = Page.sort({date: 1}).map(page => {
const date = page.date.format('YYYY-MM-DD');
return [chalk.gray(date), page.title, chalk.magenta(page.source)];
});


const header = ['Date', 'Title', 'Path'].map(str => chalk.underline(str));

data.unshift(header);

const t = table(data, {
