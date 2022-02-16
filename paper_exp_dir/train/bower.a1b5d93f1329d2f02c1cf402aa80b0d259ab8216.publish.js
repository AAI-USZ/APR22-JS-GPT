var tmp = require('tmp');
var fs = require('fs');
var path = require('path');
var glob = require('glob');

var childProcess = require('child_process');
var arraydiff = require('arr-diff');
var wrench = require('wrench');

var jsonPackage = require('./package');

if (
childProcess
.execSync('git rev-parse --abbrev-ref HEAD')
.toString()
.trim() !== 'master'
) {
console.log('You need to release bower from the "master" branch');

process.exit(1);
}

var dir = path.join(tmp.dirSync().name, 'package');


console.log('\nInstalling production bundle in:');
console.log(dir + '\n');

wrench.copyDirSyncRecursive(__dirname, dir, {
forceDelete: true,
include: function(path) {
return !path.match(/node_modules|\.git|test/);
}
});

delete jsonPackage.scripts;
delete jsonPackage.private;
for (let name of jsonPackage.workspaces) {
jsonPackage.dependencies[name.split('/').reverse()[0]] = "file:./" + name
}
delete jsonPackage.workspaces;

fs.writeFileSync(
path.resolve(dir, 'package.json'),
JSON.stringify(jsonPackage, null, '  ') + '\n'
);

console.log('Installing production dependencies...');
childProcess.execSync('yarn --production', {
cwd: dir,
stdio: [0, 1, 2]
});

delete jsonPackage.dependencies;
delete jsonPackage.resolutions;
delete jsonPackage["lint-staged"];
delete jsonPackage.devDependencies;
delete jsonPackage.files;

fs.writeFileSync(
path.resolve(dir, 'package.json'),
JSON.stringify(jsonPackage, null, '  ') + '\n'
);

glob.sync(path.join(dir, '**', '.npmignore')).forEach(function (file) {
fs.rmSync(file)
});

fs.writeFileSync(path.resolve(dir, '.npmignore'), '');

console.log('Moving node_modules to lib directory...');

wrench.copyDirSyncRecursive(
path.resolve(dir, 'node_modules'),
path.resolve(dir, 'lib', 'node_modules')
