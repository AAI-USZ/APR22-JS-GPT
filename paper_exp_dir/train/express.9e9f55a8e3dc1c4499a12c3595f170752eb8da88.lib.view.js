




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, utils = require('connect').utils
, clone = require('./utils').clone
, View = require('./view/view')
, Partial = require('./view/partial')
, merge = utils.merge
, http = require('http');



var cache = {};



exports = module.exports = View;
exports.Partial = Partial;



exports.register = View.register;



http.ServerResponse.prototype.partial = function(view, options, locals, parent){
var self = this;


if (parent && !~view.indexOf('.')) {
view += parent.extension;
}


if (options) {
if ('length' in options) {
options = { collection: options };
} else if (!options.collection && !options.locals && !options.object) {
options = { object: options };
}
} else {
options = {};
}


merge(options, locals);


if (options.locals) {
merge(options, options.locals);
}


options.renderPartial = true;
options.layout = false;


var name = options.as || Partial.resolveObjectName(view);


function render(){
if (options.object) {
if ('string' == typeof name) {
options[name] = options.object;
} else if (name === global) {
merge(options, options.object);
} else {
options.scope = options.object;
}
}
return self.render(view, options, null, parent);
}


var collection = options.collection;
if (collection) {
var len = collection.length
, buf = '';
delete options.collection;
options.collectionLength = len;
for (var i = 0; i < len; ++i) {
var val = collection[i];
options.firstInCollection = i === 0;
options.indexInCollection = i;
options.lastInCollection = i === len - 1;
options.object = val;
buf += render();
}
return buf;
} else {
return render();
}
};



http.ServerResponse.prototype.render = function(view, opts, fn, parent){

if (typeof opts === 'function') {
fn = opts, opts = null;
}

var options = {}
, self = this
, app = this.app
, helpers = app.viewHelpers
, dynamicHelpers = app.dynamicViewHelpers
, viewOptions = app.set('view options')
, cacheTemplates = app.set('cache views');


if (viewOptions) options = merge(options, viewOptions);


if (this.locals) options = merge(options, this.locals);
