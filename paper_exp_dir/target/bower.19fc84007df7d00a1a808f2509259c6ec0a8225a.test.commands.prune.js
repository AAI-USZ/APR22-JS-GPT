var mainPackage = new helpers.TempDir({
mainPackage.prepare({
return helpers.run(prune, [{}, { cwd: mainPackage.path }]).then(function() {
