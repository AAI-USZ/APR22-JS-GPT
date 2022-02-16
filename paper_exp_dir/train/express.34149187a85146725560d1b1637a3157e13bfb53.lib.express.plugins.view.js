




var Request = require('express/request').Request,
extname = require('path').extname,
fs = require('fs')



var engines = {}



var cache = { views: {}, partials: {}}



function cacheFiles(type) {
var dir = set(type)
try {
fs.readdirSync(dir).each(function(file){
file = dir + '/' + file
if (!fs.statSync(file).isFile()) return
cache[type][file] = fs.readFileSync(file)
})
} catch (e) {
if (e.errno !== process.ENOENT) throw e
}
}
