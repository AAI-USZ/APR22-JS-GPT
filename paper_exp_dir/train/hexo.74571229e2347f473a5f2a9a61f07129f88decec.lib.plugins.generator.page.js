'use strict';

function pageGenerator(locals){
return locals.pages.map(function(page){
var layout = page.layout;
var path = page.path;

if (!layout || layout === 'false'){
return {
path: path,
