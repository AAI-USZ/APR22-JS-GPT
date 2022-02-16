

var async = require('async'),
swig = require('swig');

var extend = hexo.extend,
filter = extend.filter.list(),
renderFn = hexo.render,
render = renderFn.render,
swigInit = false;
