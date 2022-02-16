

this.init = function(request, output)
{
var result = '';
var instance = this;

getDBObjectsWithValues({object_type: 'user'}, function(data)
{
if(data.length == 0)
{
output({redirect: pb.config.siteRoot + '/setup'});
return;
}

getSession(request, function(session)
{
initLocalization(request, session, function(data)
{
getHTMLTemplate('head', 'Home', null, function(data)
{
require('../include/section_map').setSectionMap(data, function(siteSettings, headLayout)
{
result = result.concat(headLayout);
getHTMLTemplate('index', null, null, function(data)
{
result = result.concat(data);

