var Promise = require('bluebird');
var util = require('../../util');
var fs = util.fs;

module.exports = function(args){
return Promise.all([
deleteDatabase(this),
deletePublicDir(this)
]);
};

function deleteDatabase(ctx){
var dbPath = ctx.database.options.path;

