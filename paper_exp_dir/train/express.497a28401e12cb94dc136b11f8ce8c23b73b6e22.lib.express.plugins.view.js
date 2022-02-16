




var Request = require('express/request').Request,
extname = require('path').extname,
fs = require('fs')



var engines = {}



var cache = { views: {}, partials: {} }




var helpers = exports.helpers = {}



function cacheFiles(type) {
(function cacheDir(dir) {
try {
fs.readdirSync(dir).each(function(file){
file = dir + '/' + file
var stat = fs.statSync(file)
if (stat.isDirectory() && file != set('partials'))
cacheDir(file)
else if (stat.isFile())
cache[type][file] = fs.readFileSync(file, 'utf8')
})
} catch (err) {
if (err.errno !== process.ENOENT) throw e
}
