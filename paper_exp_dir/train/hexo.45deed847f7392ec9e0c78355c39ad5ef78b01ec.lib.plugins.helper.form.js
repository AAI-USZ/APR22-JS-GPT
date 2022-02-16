exports.search_form = function(options){
options = options || {};

var config = this.config;
var className = options.class || 'search-form';
var text = options.hasOwnProperty('text') ? options.text : 'Search';
var button = options.button;

return '<form action="//google.com/search" method="get" accept-charset="UTF-8" class="' + className + '">' +
'<input type="search" name="q" results="0" class="' + className + '-input"' + (text ? ' placeholder="' + text + '"' : '') + '>' +
