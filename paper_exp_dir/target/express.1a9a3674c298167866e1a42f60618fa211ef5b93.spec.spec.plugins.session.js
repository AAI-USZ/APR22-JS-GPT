use(require('express/plugins/cookie').Cookie)
use(Session = require('express/plugins/session').Session)
Session.store.clear()
