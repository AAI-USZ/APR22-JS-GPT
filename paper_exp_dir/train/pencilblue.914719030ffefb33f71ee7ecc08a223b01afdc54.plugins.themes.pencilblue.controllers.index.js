

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

var section = request.pencilblue_section || null;
var topic = request.pencilblue_topic || null;
var article = request.pencilblue_article || null;
var page = request.pencilblue_page || null;

require('../include/articles').getArticles(section, topic, article, page, function(articles)
{
result = result.split('^articles^').join(articles);

require('../include/media').getCarousel(siteSettings.carousel_media, result, '^carousel^', 'index_carousel', function(newResult)
{
result = newResult;

