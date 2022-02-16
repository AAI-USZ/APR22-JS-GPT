var Schema = require('warehouse').Schema;
var util = require('../util');
var escape = util.escape;

module.exports = function(ctx){
var Category = new Schema({
name: {type: String, required: true},
parent: {type: Schema.Types.CUID, ref: 'Category'}
});

Category.virtual('slug').get(function(){
var map = ctx.config.category_map || {};
var name = this.name;
var str = '';
