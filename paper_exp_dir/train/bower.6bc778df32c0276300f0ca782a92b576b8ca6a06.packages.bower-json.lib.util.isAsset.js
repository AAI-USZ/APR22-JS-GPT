var extName = require('ext-name');

function isAsset(filename) {
var info = extName(filename);

return (
info &&
info.mime &&
(/^((image)|(audio)|(video)|(font))\
/application\/((x[-]font[-])|(font[-]woff(\d?))|(vnd[.]ms[-]fontobject))/.test(
info.mime
))
