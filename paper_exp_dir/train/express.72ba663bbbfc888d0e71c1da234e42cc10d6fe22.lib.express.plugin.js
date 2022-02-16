




var Event = exports.Event = Class({



init: function(name, data) {
this.name = name
this.request = Express.server.request
this.response = Express.server.response
process.mixin(this, data)
}
})
