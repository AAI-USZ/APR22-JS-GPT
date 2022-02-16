







var path   = require('path');
var fs     = require('fs');
var semver = require('semver');
var _      = require('lodash');

var config = require('../core/config');

function save(eventType, modifier, manager, paths) {

manager.on(eventType, manager.on('loadJSON', function () {

var pkgs = paths.map(function (curr) {
curr = curr.split('#')[0];

return _.find(Object.keys(this.dependencies), function (key) {
var dep = this.dependencies[key][0];
return dep.name === curr
|| (dep.url && dep.url === curr)
|| (dep.originalPath && dep.originalPath === curr);
}.bind(this));

}.bind(this));

pkgs = _.compact(pkgs).map(function (name) {
return this.dependencies[name][0];
}.bind(this));

pkgs.forEach(addDependency.bind(this));


fs.writeFileSync(path.join(this.cwd, config.json), JSON.stringify(this.json, null, 2));

}).loadJSON.bind(manager));
}
