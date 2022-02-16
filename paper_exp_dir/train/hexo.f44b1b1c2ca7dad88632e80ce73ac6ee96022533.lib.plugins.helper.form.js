var _ = require('lodash');

exports.search_form = function(opts){
var config = hexo.config;

var options = _.extend({
class: 'search-form',
text: 'Search',
button: false
}, opts);

return '<form action="//google.com/search" method="get" accept-charset="UTF-8" class="' + options.class + '">' +
'<input type="text" name="q" results="0" class="' + options.class + '-input"' + (options.text ? ' placeholder="' + options.text + '"' : '') + '>' +
(options.button ? '<input type="submit" value="' + (typeof options.button === 'string' ? options.button : options.text) + '" class="' + options.class + '-submit">' : '') +
