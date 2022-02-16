var Q = require('q');
var defaultConfig = require('../config');

function lookup(logger, name, config) {
if (!name) {
return new Q(null);
}


