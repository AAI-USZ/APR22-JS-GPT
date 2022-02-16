var _ = require('lodash'),
cheerio = require('cheerio'),
util = require('../../util');

module.exports = function(str, options){
options = _.extend({
class: 'toc',
list_number: true
}, options);

var $ = cheerio.load(str),
