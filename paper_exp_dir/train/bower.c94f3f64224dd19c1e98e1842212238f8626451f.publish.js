var tmp = require('tmp');
var fs = require('fs');
var path = require('path');

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

var dir = tmp.dirSync().name;


console.log('\nInstalling production bundle in:');
console.log(dir + '\n');

wrench.copyDirSyncRecursive(__dirname, dir, {
forceDelete: true,
include: function(path) {
return !path.match(/node_modules|\.git|test/);
}
});

delete jsonPackage.scripts;
fs.writeFileSync(
path.resolve(dir, 'package.json'),
JSON.stringify(jsonPackage, null, '  ') + '\n'
);

console.log('Installing production dependencies...');
childProcess.execSync('yarn --production -s', {
cwd: dir,
stdio: [0, 1, 2]
