



require('../lib/resolve/Resolver');
process.removeAllListeners('uncaughtException');

require('./resolve/resolver');
require('./resolve/resolvers/gitResolver');
require('./resolve/resolvers/gitFsResolver');
require('./resolve/resolvers/gitRemoteResolver');
