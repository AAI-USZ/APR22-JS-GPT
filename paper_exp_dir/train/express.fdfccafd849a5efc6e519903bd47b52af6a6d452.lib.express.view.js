




var extname = require('path').extname,
mime = require('connect/utils').mime,
http = require('http'),
fs = require('fs');



var engines = {};



var cache = { views: {}, partials: {} };



var helpers = exports.helpers = {};



http.ServerResponse.prototype.partial = function(view, options){
options = options || {};
options.partial = true;
options.layout = false;
if (options.collection) {
var name = options.as || view.split('.')[0].
len = options.collection.length;
options.locals = options.locals || {};
options.locals.__length__ = len;
return options.collection.map(function(val, i){
options.locals.__isFirst = i === 0;
options.locals.__index = i;
options.locals.__n = i + 1;
options.locals.__isLast = i === len - 1;
return this.render(view, options);
}, this);
} else {
this.render(view, options);
}
};



http.ServerResponse.prototype.render = function(view, options){
options = options || {};
var type = options.partial ? 'partials' : 'views',
path = set(type) + '/' + view,
parts = view.split('.'),
engine = parts[parts.length - 1],
contentType = parts.slice(-2)[0],
layout = options.layout === undefined ? 'layout' : options.layout;


options.filename = path;
options.context = options.context || this;


options.locals = options.locals || {};
for (var key in helpers) {
options.locals[key] = helpers[key];
}


var content = cache[type][path] || fs.readFileSync(path).toString(options.encoding || 'utf8');


content = (engines[engine] = engines[engine] || require(engine)).render(content, options);


if (type === 'views' && !this.headers['Content-Type']) {
this.headers['Content-Type'] = mime.type(contentType);
}


if (layout) {
layout = layout.indexOf('.') > 0
? [layout, contentType, engine].join('.')
: layout;


this.render(layout, {
layout: false,
locals: { body: content }
});
} else if (type === 'partials') {
return content;

} else {
this.writeHead(200, content, options.encoding);
}
};
