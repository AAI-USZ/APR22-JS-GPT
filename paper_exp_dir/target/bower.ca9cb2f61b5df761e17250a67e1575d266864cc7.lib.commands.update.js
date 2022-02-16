
var json  = pkg.json;
if (!json.commit && (!json.repository || json.repository === 'git' || json.repository === 'local-repo')) {
