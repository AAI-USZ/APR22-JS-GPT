




JSON.encode = JSON.stringify
JSON.decode = JSON.parse



exports.uid = function() {
var uid = ''
for (var n = 4; n; --n)
uid += (Math.abs((Math.random() * 0xFFFFFFF) | 0)).toString(16)
return uid
}



