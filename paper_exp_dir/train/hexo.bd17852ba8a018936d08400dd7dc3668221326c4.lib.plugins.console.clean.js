var Promise = require('bluebird');
var fs = require('hexo-fs');

module.exports = function(args){
return Promise.all([
deleteDatabase(this),
deletePublicDir(this)
]);
};

function deleteDatabase(ctx){
