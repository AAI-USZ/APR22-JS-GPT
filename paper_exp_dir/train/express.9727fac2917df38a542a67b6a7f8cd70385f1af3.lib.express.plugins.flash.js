


exports.Flash = Plugin.extend({
extend: {



init: function(){
Request.include({



flash: function(key, val) {
if (!this.session.flash) this.session.flash = {}
if (!(key in this.session.flash)) this.session.flash[key] = []
if (val)
