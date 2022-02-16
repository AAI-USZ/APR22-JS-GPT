


(function(){

Express.Mime = {
name : 'mime',

settings : {
defaultType : 'application/octet-stream'
},

utilities : {



mime : function(ext) {
if (ext.indexOf('.') != -1)
ext = ext.substring(ext.lastIndexOf('.') + 1, ext.length)
return Express.utilities.mimeTypes[ext] || Express.settings.mime.defaultType

},

mimeTypes : {
"3gp"     : "video/3gpp",
"a"       : "application/octet-stream",
"ai"      : "application/postscript",
"aif"     : "audio/x-aiff",
