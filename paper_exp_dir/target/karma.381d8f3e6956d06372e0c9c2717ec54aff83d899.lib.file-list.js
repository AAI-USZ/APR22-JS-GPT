var helper = require('./helper');
done(err, results.map(helper.normalizeWinPath));
if (helper.isUrlAbsolute(pattern)) {
