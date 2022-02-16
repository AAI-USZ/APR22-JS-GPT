


exports.Flash = Plugin.extend({
extend: {



init: function(){
Request.include({



flash: function(key, val) {
if (!this.session.flash) this.session.flash = {}
if (!key) {
var flashes = this.session.flash
this.session.flash = {}
return flashes
}
if (!(key in this.session.flash)) this.session.flash[key] = []
if (val)
return this.session.flash[key].push(val), val
else if (key) {
var vals = this.session.flash[key]
