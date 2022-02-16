


var mime = require('connect').mime;



exports.locals = function(obj){
obj.viewCallbacks = obj.viewCallbacks || [];

function locals(obj){
for (var key in obj) locals[key] = obj[key];
return obj;
};

return locals;
};



exports.isAbsolute = function(path){
if ('/' == path[0]) return true;
if (':' == path[1] && '\\' == path[2]) return true;
};

