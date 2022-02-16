define(function(require, exports, module){
return ['$scope', '$http', '$state', '$stateParams', '$filter', 'apiBaseUrl',
function($scope, $http, $state, $stateParams, $filter, apiBaseUrl){

var path = $stateParams.path.replace('$', '/');

var breadcrumbs = $scope.$parent.breadcrumbs = [],
paths = path.split('/');

for (var i = 0, len = paths.length; i < len; i++){
if (!paths[i]) break;

breadcrumbs.push({
name: paths[i],
path: paths.slice(0, i + 1).join('/')
});
}

$scope.columnType = 0;
$scope.order = 'name';
$scope.files = [];
$scope.selected = [];

$http.get(apiBaseUrl + 'files/list/' + path)
.success(function(data){
for (var i = 0, len = data.length; i < len; i++){
var item = data[i];

if (item.is_dir){
item.type = 'Folder';
item.size = '--';
item.link = 'files/list/' + item.path.replace('/', '$');
item.icon = 'icon-folder-close';
} else {
item.type = $filter('mimeType')(item.mime);
item.ext = item.name.match(/\.(\w+)$/)[1];
item.size = $filter('size')(item.size);
item.link = 'api/files/download/' + item.path;

switch (item.type){
case 'Image':
item.icon = 'icon-picture';
