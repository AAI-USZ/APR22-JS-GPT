if ('stack' in e)
require('sys').puts(e.stack + '\n')
throw (message ? message : '') + e.toString() +
