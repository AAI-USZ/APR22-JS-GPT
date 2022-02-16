




var utils = require('../utils');



module.exports = Route;



function Route(method, path, callbacks, options) {
options = options || {};
this.path = path;
