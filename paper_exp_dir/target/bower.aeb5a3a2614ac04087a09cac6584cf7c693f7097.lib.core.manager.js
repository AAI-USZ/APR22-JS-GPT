Object.keys(this.dependencies).forEach(function (key) {
packages[key] = this.dependencies[key][0];
}.bind(this));
