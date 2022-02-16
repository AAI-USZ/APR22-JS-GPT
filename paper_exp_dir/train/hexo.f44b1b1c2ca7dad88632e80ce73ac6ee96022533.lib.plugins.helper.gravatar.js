var crypto = require('crypto'),
_ = require('lodash');

var md5 = function(str){
return crypto.createHash('md5').update(str).digest('hex');
};

module.exports = function(email, options){
if (_.isNumber(options)){
options = {s: options};
