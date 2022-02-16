define([
'lib/angular',
'module',
'controllers',
'filters',
'services',
'directives',
'plugins/angular-ui-router',
'plugins/angular-ui-bootstrap'
], function(angular, module){
var config = module.config(),
base = config.base;

var app = angular.module('hexo', [
'ui.state',
'ui.bootstrap',
'hexo.controllers',
