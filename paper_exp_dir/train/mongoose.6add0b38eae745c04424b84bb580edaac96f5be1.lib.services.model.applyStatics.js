'use strict';


module.exports = function applyStatics(model, schema) {
for (var i in schema.statics) {
model[i] = schema.statics[i];
}
};
