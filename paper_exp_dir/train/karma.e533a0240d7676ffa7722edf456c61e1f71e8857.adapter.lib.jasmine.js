var isCommonJS = typeof window == "undefined" && typeof exports == "object";


var jasmine = {};
if (isCommonJS) exports.jasmine = jasmine;

jasmine.unimplementedMethod_ = function() {
throw new Error("unimplemented method");
};


jasmine.undefined = jasmine.___undefined___;


jasmine.VERBOSE = false;


jasmine.DEFAULT_UPDATE_INTERVAL = 250;


jasmine.MAX_PRETTY_PRINT_DEPTH = 40;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;


jasmine.CATCH_EXCEPTIONS = true;

jasmine.getGlobal = function() {
function getGlobal() {
