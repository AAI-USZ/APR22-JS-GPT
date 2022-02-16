



require('../lib/resolve/Resolver');
process.removeAllListeners('uncaughtException');

require('./resolve/resolver');
require('./resolve/resolvers/urlResolver');
require('./resolve/resolvers/fsResolver');
require('./resolve/resolvers/gitResolver');
require('./resolve/resolvers/gitFsResolver');
require('./resolve/resolvers/gitRemoteResolver');
require('./resolve/worker');

