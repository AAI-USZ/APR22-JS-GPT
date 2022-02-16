var _    = require('lodash');
var fs   = require('fs');
var path = require('path');


var OS = /(iPhone OS|Mac OS X|Windows|Linux)/;
var OS_MAP = {
"iPhone OS": "iOS",
"Mac OS X": "Mac"
};
