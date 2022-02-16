return helpers.run(installPackage3).then(function () {
package.path = path.join(rootDir.path, 'src/a/b');
package2.path = path.join(rootDir.path, 'src/a');
