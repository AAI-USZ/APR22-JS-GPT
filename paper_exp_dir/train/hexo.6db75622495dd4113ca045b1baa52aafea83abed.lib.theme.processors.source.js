var Pattern = require('../../box/pattern');
var common = require('../../plugins/processor/common');

exports.process = function(file){
var Asset = this.model('Asset');
var id = file.source.substring(this.base_dir.length);
var path = file.params.path;
var doc = Asset.findById(id);

if (file.type === 'delete'){
if (doc){
