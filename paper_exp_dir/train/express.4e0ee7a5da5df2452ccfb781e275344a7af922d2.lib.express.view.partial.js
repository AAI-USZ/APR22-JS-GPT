




var View = require('./view')
, basename = require('path').basename
, stat = require('fs').statSync;



var cache = {};



var Partial = exports = module.exports = function Partial(view, options) {
options = options || {};
View.call(this, view, options);
this.path = this.resolvePartialPath(this.dirname);
};
