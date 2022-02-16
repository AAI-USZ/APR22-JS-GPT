module.exports = ctx => function multiConfigPath(base, configPaths, outputDir) {
const multiconfigRoot = outputDir || base;
const outputPath = pathFn.join(multiconfigRoot, '_multiconfig.yml');
