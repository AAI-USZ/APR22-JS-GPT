

global.url        = require('url');
global.fs         = require('fs');
global.http       = require('http');
global.path       = require('path');
global.formidable = require('formidable');
global.process    = require('process');
global.minify     = require('minify');
global.winston    = require('winston');
global.async      = require('async');

var promise       = require('node-promise');
global.when       = promise.when;
global.Promise    = promise.Promise;


fs.exists     = fs.exists     || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;


var pb = {};


pb.config = require('./config');


global.log =
pb.log = require(DOCUMENT_ROOT+'/include/utils/logging.js').logger(winston, pb.config);


pb.dbm = new (require(DOCUMENT_ROOT+'/include/dao/db_manager').DBManager);


pb.DAO = require(DOCUMENT_ROOT+'/include/dao/dao');


require(DOCUMENT_ROOT+'/include/response_head');
require(DOCUMENT_ROOT+'/include/router');
require(DOCUMENT_ROOT+'/include/query');
require(DOCUMENT_ROOT+'/include/unique_id');
require(DOCUMENT_ROOT+'/include/session');
require(DOCUMENT_ROOT+'/include/model/db_object');
require(DOCUMENT_ROOT+'/include/access_management.js');
require(DOCUMENT_ROOT+'/include/model/create_document.js');
require(DOCUMENT_ROOT+'/include/templates');
require(DOCUMENT_ROOT+'/include/localization');
require(DOCUMENT_ROOT+'/include/client_js');
require(DOCUMENT_ROOT+'/include/admin_navigation');
require(DOCUMENT_ROOT+'/include/error_success');
require(DOCUMENT_ROOT+'/include/form');


