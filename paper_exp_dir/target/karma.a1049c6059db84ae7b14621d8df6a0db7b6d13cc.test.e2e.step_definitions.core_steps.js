Then('it passes with( {exact}):', { timeout: 10 * 1000 }, function (mode, expectedOutput, callback) {
const data = fs.readFileSync(filePath, { encoding: 'UTF-8' })
