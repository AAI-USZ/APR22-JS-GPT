log.debug(`Missing plugin "${pkgName}". Installing...`)
exec(`npm install ${pkgName} --save-dev`, options, function (err, stdout, stderr) {
log.debug(`${pkgName} successfully installed.`)
