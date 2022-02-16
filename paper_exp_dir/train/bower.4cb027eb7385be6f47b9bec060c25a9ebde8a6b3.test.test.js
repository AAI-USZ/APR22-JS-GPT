



require('../lib/core/resolvers/Resolver');
process.removeAllListeners('uncaughtException');

require('./core/resolvers/resolver');
require('./core/resolvers/urlResolver');
require('./core/resolvers/fsResolver');
require('./core/resolvers/gitResolver');
require('./core/resolvers/gitFsResolver');
require('./core/resolvers/gitRemoteResolver');
require('./core/resolvers/gitHubResolver');
require('./core/resolvers/svnResolver');
require('./core/resolverFactory');
require('./core/resolveCache');
require('./core/packageRepository');
require('./core/scripts');
require('./core/Manager');
require('./renderers/StandardRenderer.js');
require('./commands/index.js');
