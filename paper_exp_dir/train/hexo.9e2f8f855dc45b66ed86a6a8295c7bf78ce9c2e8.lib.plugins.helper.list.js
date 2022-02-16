var extend = require('../../extend'),
_ = require('lodash'),
moment = require('moment'),
root = hexo.config.root,
archiveDir = hexo.config.archive_dir;

var result = function(prefix, obj, options){
var defaults = {
orderby: 'name',
order: 1,
show_count: true
};

var options = _.extend(defaults, options);

var result = '<ul class="' + prefix + '-list">',
orderby = options.orderby,
order = options.order,
showCount = options.show_count;

if (orderby){
obj = obj.sort(orderby, order);
}

obj.each(function(item){
if (!item.length) return;

result += '<li class="' + prefix + '-item">' +
'<a href="' + root + item.path + '" class="' + prefix + '-link">' + item.name + '</a>' +
(showCount ? '<span class="' + prefix + '-count">' + item.length + '</span>' : '') +
'</li>';
});

return result + '</ul>';
};

extend.helper.register('list_categories', function(options){
return result('category', this.site.categories, options);
});

extend.helper.register('list_tags', function(options){
return result('tag', this.site.tags, options);
});

extend.helper.register('list_archives', function(options){
var defaults = {
type: 'monthly',
order: 1,
