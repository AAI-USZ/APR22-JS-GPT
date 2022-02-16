var cheerio = require('cheerio');

function tocHelper(str, options){
options = options || {};

var $ = cheerio.load(str);
var headings = $('h1, h2, h3, h4, h5, h6');

if (!headings.length) return '';

