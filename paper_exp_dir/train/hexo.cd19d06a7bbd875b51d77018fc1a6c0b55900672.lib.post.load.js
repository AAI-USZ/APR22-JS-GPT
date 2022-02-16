var _ = require('lodash'),
async = require('async');



module.exports = function(options, callback){
if (!callback){
if (typeof options === 'function'){
callback = options;
options = {};
} else {
callback = function(){};
}
