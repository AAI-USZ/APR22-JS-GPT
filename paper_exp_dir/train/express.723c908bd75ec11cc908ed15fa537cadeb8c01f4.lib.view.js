




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, utils = require('connect').utils
, View = require('./view/view')
, partial = require('./view/partial')
, union = require('./utils').union
, merge = utils.merge
, http = require('http')
, res = http.ServerResponse.prototype;



var cache = {};



exports = module.exports = View;



exports.register = View.register;



function renderPartial(res, view, options, parentLocals, parent){
var collection, object, locals;


if (parent && !~view.indexOf('.')) {
view += parent.extension;
}

if (options) {

if (options.collection) {
collection = options.collection;
delete options.collection;
} else if ('length' in options) {
collection = options;
options = {};
}


if (options.locals) {
locals = options.locals;
delete options.locals;
}


if ('Object' != options.constructor.name) {
object = options;
options = {};
} else if (undefined != options.object) {
object = options.object;
delete options.object;
}
} else {
options = {};
}


union(options, parentLocals);


if (locals) merge(options, locals);


options.renderPartial = true;
options.layout = false;


var name = options.as || partial.resolveObjectName(view);


function render(){
if (object) {
if ('string' == typeof name) {
options[name] = object;
} else if (name === global) {
merge(options, object);
} else {
options.scope = object;
}
}
return res.render(view, options, null, parent);
}


if (collection) {
var len = collection.length
, buf = '';
options.collectionLength = len;
for (var i = 0; i < len; ++i) {
var val = collection[i];
options.firstInCollection = i === 0;
options.indexInCollection = i;
options.lastInCollection = i === len - 1;
object = val;
buf += render();
}
return buf;
} else {
return render();
}
};



res.partial = function(view, options, fn){
var app = this.app
, options = options || {}
, parent = {};


if ('function' == typeof options) {
fn = options;
options = {};
}


parent.dirname = app.set('views') || process.cwd() + '/views';


