


exports.Flash = Plugin.extend({
extend: {



init: function(){
Request.include({



flash: function(key, val) {
if (!this.session.flash) this.session.flash = {}
if (!(key in this.session.flash)) this.session.flash[key] = []
if (val)
return this.session.flash[key].push(val), val
else if (key) {
var vals = this.session.flash[key]
delete this.session.flash[key]
if (vals.length) return vals
}
}
})
}
}
})
