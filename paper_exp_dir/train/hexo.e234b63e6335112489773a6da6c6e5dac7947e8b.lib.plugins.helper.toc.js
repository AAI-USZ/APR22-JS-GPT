var _ = require('lodash'),
util = require('../../util');

var rHeadingAll = /<h(\d)(.*?)>(.+?)<\/h\d>/g,
rHeading = /<h(\d).*id="(.+?)".*>(.+?)<\/h\d>/;

module.exports = function(str, options){
var options = _.extend({
class: 'toc',
list_number: true
}, options);

var headings = str.match(rHeadingAll),
data = [],
result = '<ol class="' + options.class + '">',
lastNumber = {},
firstLevel = 0,
lastLevel = 0;

if (!headings || !headings.length) return '';

for (var i = 1; i <= 6; i++){
lastNumber[i] = 0;
}
headings.forEach(function(heading, i){
if (!rHeading.test(heading)) return;

var match = heading.match(rHeading);

data.push({
level: +match[1],
id: match[2],
text: match[3]
