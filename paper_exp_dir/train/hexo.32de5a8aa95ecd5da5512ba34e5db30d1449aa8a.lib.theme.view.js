var pathFn = require('path');
var _ = require('lodash');
var yfm = require('hexo-front-matter');

function View(path, data){
this.path = path;
this.source = pathFn.join(this._theme.base, 'layout', path);
this.data = typeof data === 'string' ? yfm(data) : data;
}

View.prototype.render = function(options, callback){
if (!callback && typeof options === 'function'){
callback = options;
options = {};
}

options = options || {};

var data = this.data;
var layout = data.hasOwnProperty('layout') ? data.layout : options.layout;
var locals = this._buildLocals(options);
var self = this;

return this._render.render({
path: this.source,
text: data._content
}, this._bindHelpers(locals)).then(function(result){
if (!layout) return result;

var layoutView = self._resolveLayout(layout);
if (!layoutView) return result;

var layoutLocals = _.clone(locals);
layoutLocals.body = result;
layoutLocals.layout = false;

return layoutView.render(layoutLocals, callback);
}).nodeify(callback);
};

View.prototype.renderSync = function(options){
options = options || {};

var data = this.data;
var layout = data.hasOwnProperty('layout') ? data.layout : options.layout;
var locals = this._buildLocals(options);

var result = this._render.renderSync({
path: this.source,
text: data._content
}, this._bindHelpers(locals));

if (result == null || !layout) return result;

var layoutView = this._resolveLayout(layout);
if (!layoutView) return result;

var layoutLocals = _.clone(locals);
layoutLocals.body = result;
layoutLocals.layout = false;

return layoutView.renderSync(layoutLocals);
};

View.prototype._buildLocals = function(locals){
var data = this.data;
var result = {};
var keys = [];
var key = '';
var i, len;


for (i in locals){
result[i] = locals[i];
}


keys = Object.keys(data);

for (i = 0, len = keys.length; i < len; i++){
key = keys[i];
if (key !== 'layout' && key !== '_content') result[key] = data[key];
}
