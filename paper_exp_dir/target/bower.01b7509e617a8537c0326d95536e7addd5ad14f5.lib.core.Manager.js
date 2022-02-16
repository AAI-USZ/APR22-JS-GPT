var dissected = this._dissected[name] || (this._resolved[name] ? this._resolved[name][0] : dependency);
pkg.dependencies[name] = dissected;
var name = dependant.name;
