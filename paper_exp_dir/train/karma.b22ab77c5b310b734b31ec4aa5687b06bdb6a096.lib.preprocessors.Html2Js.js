var util = require('util');
var log = require('../logger').create('preprocess.html2js');


var template = "angular.module('%s', []).run(function($templateCache) {\n" +
"  $templateCache.put('%s',\n    '%s');\n" +
"});\n";

var escapeContent = function(content) {
return content.replace(/'/g, "\\'").replace(/\n/g, "' +\n    '");
};

