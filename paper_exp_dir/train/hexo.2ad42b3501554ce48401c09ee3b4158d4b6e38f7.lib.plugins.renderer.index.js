module.exports = function(ctx){
var renderer = ctx.extend.renderer;

var html = require('./html');

renderer.register('htm', 'html', html, true);
renderer.register('html', 'html', html, true);

renderer.register('swig', 'html', require('./swig'), true);

