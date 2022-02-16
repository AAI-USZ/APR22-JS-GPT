
// Express - Plugins - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

global.merge(require('express/plugins/hooks'))
global.merge(require('express/plugins/flash'))
global.merge(require('express/plugins/cache'))
global.merge(require('express/plugins/cookie'))
global.merge(require('express/plugins/session'))
global.merge(require('express/plugins/profiler'))
global.merge(require('express/plugins/common-logger'))
global.merge(require('express/plugins/content-length'))
global.merge(require('express/plugins/method-override'))
