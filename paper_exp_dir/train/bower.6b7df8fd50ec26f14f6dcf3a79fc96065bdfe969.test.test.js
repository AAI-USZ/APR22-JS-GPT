



require('../lib/resolve/Resolver');
process.removeAllListeners('uncaughtException');


require('./resolve/resolvers/urlResolver');
require('./resolve/resolvers/fsResolver');





