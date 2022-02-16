tagColor = '',
self = this;
result += '<a href="' + self.url_for(tag.path) + '" style="font-size: ' + size.toFixed(2) + unit + ';' + (tagColor || '') + '">' + tag.name + '</a>';
