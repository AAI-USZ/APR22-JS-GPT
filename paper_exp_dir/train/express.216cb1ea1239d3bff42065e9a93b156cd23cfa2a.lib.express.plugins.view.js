




var Request = require('express/request').Request,
extname = require('path').extname,
fs = require('fs')



var engines = {}



var cache = { views: {}, partials: {} }



var Globals = exports.Globals = {}



function cacheFiles(type) {
var dir = set(type)
try {
fs.readdirSync(dir).each(function(file){
file = dir + '/' + file
