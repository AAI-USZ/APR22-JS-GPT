




var utils = require('../utils');



module.exports = Route;



function Route(method, path, callbacks, options) {
options = options || {};
this.path = path;
this.method = method;
this.callbacks = callbacks;
this.regexp = utils.pathRegexp(path
, this.keys = []
, options.sensitive
, options.strict);
}



Route.prototype.match = function(path){
var keys = this.keys
, params = this.params = []
