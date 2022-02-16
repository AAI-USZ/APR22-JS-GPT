define(function(require, exports, module){
var $ = require('lib/jquery');

require(['codemirror/mode/markdown/markdown'])

return ['$scope', '$http', '$state', '$stateParams', '$filter', '$window', 'apiBaseUrl', 'templateBaseUrl',
function($scope, $http, $state, $stateParams, $filter, $window, apiBaseUrl, templateBaseUrl){

var id = $stateParams.id;

$scope.cmOptions = {
lineWrapping: true,
theme: 'neat',
