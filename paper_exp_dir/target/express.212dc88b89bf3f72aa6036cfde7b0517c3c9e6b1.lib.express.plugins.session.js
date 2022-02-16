exports.Base = new Class({
fetch: function(sid, callback) {
if(sid && this.store[sid]) callback( null, this.store[sid] );
