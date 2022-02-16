var PackageRepository = require('../core/PackageRepository');
config = defaultConfig(config);
var repository = new PackageRepository(config, logger);
