

var spawn = require('child_process').spawn;

if (/0\.10/.test(process.versions.node)) {
spawn('npm', ['install', 'log4js@0.6.2'], {stdio: 'inherit'});
} else if (/0\.8/.test(process.versions.node)) {
