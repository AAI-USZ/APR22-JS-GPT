




var crypto = require('crypto');



var len = 128;



var iterations = 12000;



exports.hash = function (pwd, salt, fn) {
if (3 == arguments.length) {
