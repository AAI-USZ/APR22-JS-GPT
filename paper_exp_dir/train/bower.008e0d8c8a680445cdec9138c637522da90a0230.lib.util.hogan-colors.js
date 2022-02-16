







var colors = require('colors');
var hogan  = require('hogan.js');
var _      = require('lodash');

var selfReturn = function (s) { return s; };

hogan.Template.prototype.renderWithColors = function (context, partials, indent) {
context = _.extend({
yellow : function (s) { return s.yellow; },
green  : function (s) { return s.green;  },
cyan   : function (s) { return s.cyan;   },
grey   : function (s) { return s.grey;   },
red    : function (s) { return s.red;    }
}, context);
