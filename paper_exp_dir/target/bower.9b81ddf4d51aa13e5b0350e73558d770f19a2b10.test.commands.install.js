it.skip('installs a package', function () {
this.timeout(10000);
var logger = bower.commands.install(['underscore'], undefined, config);
