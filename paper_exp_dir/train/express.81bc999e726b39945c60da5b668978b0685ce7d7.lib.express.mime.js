


Express.mime = function(ext) {
if (ext.indexOf('.') != -1)
ext = ext.substring(ext.lastIndexOf('.') + 1, ext.length)
return Express.mimeTypes[ext]
}

Express.mimeTypes = {
"3gp"     : "video/3gpp",
