if (process.env.SKIP_TESTS !== '1') {
grunt.log.writeln('Reinstalling dependencies...');
childProcess.execSync('rm -rf node_modules && npm install', { stdio: [0, 1, 2] });
