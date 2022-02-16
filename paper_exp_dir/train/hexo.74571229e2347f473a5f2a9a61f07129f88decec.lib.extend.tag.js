'use strict';

var stripIndent = require('strip-indent');
var swig = require('swig');

function Tag(){
this.swig = new swig.Swig({
autoescape: false
});
}
