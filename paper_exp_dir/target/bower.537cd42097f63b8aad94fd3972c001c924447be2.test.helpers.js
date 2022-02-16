TempDir.prototype.create = function (files, defaults) {
defaults = defaults || this.defaults || {};
files = object.merge(files || {}, defaults);
