const { toDate, timezone, isExcludedFile, isTmpFile, isHiddenFile, isMatch } = require('./common');
const { timezone: timezoneCfg, use_date_for_updated } = config;
data.date = toDate(data.date);
