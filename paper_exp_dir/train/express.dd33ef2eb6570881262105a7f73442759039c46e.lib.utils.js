




var mime = require('mime');



exports.locals = function(obj){
obj.viewCallbacks = obj.viewCallbacks || [];

function locals(obj){
for (var key in obj) locals[key] = obj[key];
return obj;
};

locals.use = function(fn){
if (3 == fn.length) {
