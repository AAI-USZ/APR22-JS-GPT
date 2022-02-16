var queryParams = util.parseQueryParams(location.search);
var browserId = queryParams.id || util.generateId('manual-');
var returnUrl = queryParams.return_url || null;
