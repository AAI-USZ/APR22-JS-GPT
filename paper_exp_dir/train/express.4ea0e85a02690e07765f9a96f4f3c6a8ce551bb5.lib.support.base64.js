



exports.encode = function(str) {
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var encoded = [];
var c = 0;
while (c < str.length) {
var b0 = str.charCodeAt(c++);
var b1 = str.charCodeAt(c++);
var b2 = str.charCodeAt(c++);
var buf = (b0 << 16) + ((b1 || 0) << 8) + (b2 || 0);
