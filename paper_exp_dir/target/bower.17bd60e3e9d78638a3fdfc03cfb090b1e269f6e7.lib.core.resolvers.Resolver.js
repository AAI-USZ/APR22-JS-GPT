Resolver.prototype.isNotCacheable = function () {
if (this._source &&
/^(?:file:[\/\\]{2})?\.?\.?[\/\\]/.test(this._source)
