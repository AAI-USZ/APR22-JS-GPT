'use strict';

function cssHelper(){

var result = '';
var path = '';

for (var i = 0, len = arguments.length; i < len; i++){
path = arguments[i];

if (Array.isArray(path)){
result += cssHelper.apply(this, path);
