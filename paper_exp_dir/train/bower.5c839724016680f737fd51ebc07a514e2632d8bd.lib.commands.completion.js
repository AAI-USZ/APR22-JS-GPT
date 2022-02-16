var Q = require('q');
var cli = require('../util/cli');

function completion(config) {
return new Q();
}



completion.line = function (logger, argv) {
var options = cli.readOptions(argv);
var name = options.argv.remain[1];

return completion(logger, name);
