


var utils = require('express/utils')
utils.mixin(require('express/plugins/hooks'))
utils.mixin(require('express/plugins/flash'))
utils.mixin(require('express/plugins/cache'))
utils.mixin(require('express/plugins/cookie'))
utils.mixin(require('express/plugins/session'))
utils.mixin(require('express/plugins/profiler'))
utils.mixin(require('express/plugins/common-logger'))
utils.mixin(require('express/plugins/logger'))
utils.mixin(require('express/plugins/content-length'))
