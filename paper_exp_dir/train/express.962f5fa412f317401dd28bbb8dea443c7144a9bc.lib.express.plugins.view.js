




var utils = require('express/utils'),
extname = require('path').extname,
fs = require('fs')



var engine = {
ejs: require('ejs'),
haml: require('haml'),
sass: require('sass')
}



exports.View = Plugin.extend({
