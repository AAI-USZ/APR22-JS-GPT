var dependencies = this.json.dependencies;
if (!this.opts.production && this.json.devDependencies) {
dependencies = _.extend({}, dependencies, this.json.devDependencies)
