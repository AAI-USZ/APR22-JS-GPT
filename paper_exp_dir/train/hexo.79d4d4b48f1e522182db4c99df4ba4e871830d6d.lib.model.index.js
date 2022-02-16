

var _ = require('lodash'),
Database = require('warehouse'),
db = new Database(hexo.base_dir + 'db.json'),
schema = require('./schema')(db.Schema);



var store = {};
