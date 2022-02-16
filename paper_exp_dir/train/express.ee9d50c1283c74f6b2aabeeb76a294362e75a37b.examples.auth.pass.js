




var crypto = require('crypto');



var len = 128;



var iterations = 12000;



exports.hash = function (pwd, salt, fn) {
if (3 == arguments.length) {
crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
fn(err, (new Buffer(hash, 'binary')).toString('base64'));
});
} else {
fn = salt;
crypto.randomBytes(len, function(err, salt){
if (err) return fn(err);
salt = salt.toString('base64');
crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
if (err) return fn(err);
