var Schema = require('warehouse').Schema;
var util = require('../util');
var escape = util.escape;

module.exports = function(ctx){
var Tag = new Schema({
name: {type: String, required: true}
});

Tag.virtual('slug').get(function(){
var map = ctx.config.tag_map || {};
var name = this.name;
if (!name) return;

name = map[name] || name;
return escape.filename(name, ctx.config.filename_case);
});

