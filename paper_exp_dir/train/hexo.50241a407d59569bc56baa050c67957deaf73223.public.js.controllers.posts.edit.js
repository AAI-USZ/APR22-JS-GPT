define(function(require, exports, module){
var $ = require('lib/jquery');

require(['codemirror/mode/markdown/markdown'])

return ['$scope', '$http', '$state', '$stateParams', '$filter', '$window', 'rootUrl', 'apiBaseUrl', 'templateBaseUrl',
function($scope, $http, $state, $stateParams, $filter, $window, rootUrl, apiBaseUrl, templateBaseUrl){

var id = $stateParams.id;

$scope.cmOptions = {
lineWrapping: true,
theme: 'neat',
mode: 'markdown',
extraKeys: {
'Cmd-S': function(){
$scope.save();
},
'Ctrl-S': function(){
$scope.save();
},
Esc: function(){
if ($scope.isFullscreen) $scope.fullscreen();
}
}
};

$scope.$parent.selected = id;

$scope.save = function(){
if ($scope.isSaving) return;
