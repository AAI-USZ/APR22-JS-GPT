var Database = require('warehouse'),
fs = require('graceful-fs'),
path = require('path'),
async = require('async'),
Model = require('../model');

module.exports = function(callback){
var db = new Database(),
dbPath = path.join(hexo.base_dir, 'db.json');



var model = hexo.model = new Model(db);

async.series([
function(next){
fs.exists(dbPath, function(exist){
if (!exist) return next();

hexo.log.d('Loading database.');

db.load(dbPath, function(err){
