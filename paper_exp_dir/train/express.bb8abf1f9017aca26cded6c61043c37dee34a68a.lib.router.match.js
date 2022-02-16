


module.exports = Match;

function Match(layer, path, params) {
this.layer = layer;
this.params = {};
this.path = path || '';

if (!params) {
return this;
}
