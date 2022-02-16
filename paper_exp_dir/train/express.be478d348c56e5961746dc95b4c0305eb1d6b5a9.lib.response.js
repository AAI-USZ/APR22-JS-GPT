

var deprecate = require('depd')('express');
var escapeHtml = require('escape-html');
var parseUrl = require('parseurl');
var vary = require('vary');
var http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, sign = require('cookie-signature').sign
, normalizeType = require('./utils').normalizeType
, normalizeTypes = require('./utils').normalizeTypes
, setCharset = require('./utils').setCharset
