var commands = require('./commands');
var version = require('./version');
var abbreviations = require('./util/abbreviations')(commands);

function clearRuntimeCache() {



var PackageRepository = require('./core/PackageRepository');
PackageRepository.clearRuntimeCache();
}

module.exports = {
version: version,
commands: commands,
config: require('./config')(),
abbreviations: abbreviations,
reset: clearRuntimeCache
};
