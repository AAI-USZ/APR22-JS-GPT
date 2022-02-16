var chalk = require('chalk');
var table = require('./table');

function listPage(){
var Page = this.model('Page');

var data = Page.sort({date: 1}).map(function(page){
var date = page.date.format('YYYY-MM-DD');
return [chalk.gray(date), page.title, chalk.magenta(page.source)];
});


var header = ['Date', 'Title', 'Path'].map(function(str){
return chalk.underline(str);
});

data.unshift(header);
