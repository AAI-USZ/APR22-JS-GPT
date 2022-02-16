




var Url = function (path, type) {
this.path = path
this.type = type
this.isUrl = true
}

Url.prototype.toString = function () {
return this.path
}


