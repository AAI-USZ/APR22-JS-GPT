

var extend = require('../extend'),
renderSync = require('../render').renderSync,
util = require('../util'),
titlecase = util.titlecase;

var regex = {
fullCiteWithTitle: /(\S.*)\s+(https?:\/\/)(\S+)\s+(.+)/i,
fullCite: /(\S.*)\s+(https?:\/\/)(\S+)/i,
authorWithSource: /([^,]+),([^,]+)/,
author: /(.+)/
};
