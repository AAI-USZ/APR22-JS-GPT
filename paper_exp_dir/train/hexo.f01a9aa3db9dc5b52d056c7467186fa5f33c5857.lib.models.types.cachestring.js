'use strict';

var SchemaTypeString = require('warehouse').Schema.Types.String;
var util = require('util');

function SchemaTypeCacheString(name, options) {
SchemaTypeString.call(this, name, options);
}

util.inherits(SchemaTypeCacheString, SchemaTypeString);

SchemaTypeCacheString.prototype.value = function() {

return;
};

module.exports = SchemaTypeCacheString;
