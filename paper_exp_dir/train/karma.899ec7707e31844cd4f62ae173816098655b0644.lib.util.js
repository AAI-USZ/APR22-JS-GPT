var OS = /(iPhone OS|Mac OS X|Windows|Linux)/;
var OS_MAP = {
"iPhone OS": "iOS",
"Mac OS X": "Mac"
};

var BROWSER = /(Chrome|Firefox|Opera|Safari|PhantomJS)\/([0-9]*\.[0-9]*)/;
var VERSION = /Version\/([0-9]*\.[0-9]*)/;
var MSIE = /MSIE ([0-9]*\.[0-9]*)/;


exports.browserFullNameToShort = function(fullName) {
var os = '';
var osMatch = fullName.match(OS);
if (osMatch) {
os = osMatch[1];
os = ' (' + (OS_MAP[os] || os) + ')';
}

var browserMatch = fullName.match(BROWSER);
if (browserMatch) {
var versionMatch = fullName.match(VERSION);
return browserMatch[1] + ' ' + (versionMatch && versionMatch[1] || browserMatch[2]) + os;
}

var ieMatch = fullName.match(MSIE);
if (ieMatch) {
return 'IE ' + ieMatch[1] + os;
}

return fullName;
};


exports.isDefined = function(value) {
return typeof value !== 'undefined';
};


exports.isFunction = function(value) {
return typeof value === 'function';
};


exports.isString = function(value) {
return typeof value === 'string';
};


exports.isObject = function(value) {
return typeof value === 'object';
};


var ABS_URL = /^https?:\/\
exports.isUrlAbsolute = function(url) {
return ABS_URL.test(url);
};


