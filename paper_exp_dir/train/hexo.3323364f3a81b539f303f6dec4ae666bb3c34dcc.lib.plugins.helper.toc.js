var _ = require('lodash');
var cheerio = require('cheerio');

module.exports = function(str, options){
options = _.extend({
class: 'toc',
list_number: true
}, options);

var $ = cheerio.load(str),
