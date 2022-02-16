




var posix = require('posix'),
utils = require('express/utils')



var engine = {
ejs: require('ejs'),
haml: require('haml'),
sass: require('sass')
}



exports.View = Plugin.extend({
