

process.removeAllListeners('uncaughtException');

require('./resolve/resolver');
require('./resolve/resolvers/gitResolver');
require('./resolve/resolvers/gitFsResolver');
require('./resolve/resolvers/gitRemoteResolver');
require('./resolve/resolvers/fsResolver');
require('./resolve/worker');
