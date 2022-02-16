var format = require('util').format,
fs = require('fs'),
_ = require('underscore'),
lang = 'default',
compile;

var i18n = function(){
var store = {};

this.get = function(){
var args = _.toArray(arguments),
str = args.shift(),
split = str.split('.'),
cursor = store;

for (var i=0, len=split.length; i<len; i++){
var item = split[i];
cursor = cursor[item];
}

if (_.isArray(cursor)){
var number = args.shift();

if (cursor.length === 3){
if (number > 1) cursor = cursor[2];
else if (number === 0) cursor = cursor[0];
else cursor = cursor[1];
} else {
if (number > 1) cursor = cursor[1];
else cursor = cursor[0];
