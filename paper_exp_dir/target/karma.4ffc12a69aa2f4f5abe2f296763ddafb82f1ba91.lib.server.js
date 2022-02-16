exports.start = function(cliOptions) {
var config = cfg.parseConfig(cliOptions.configFile, cliOptions);
if (config.autoWatch) {
