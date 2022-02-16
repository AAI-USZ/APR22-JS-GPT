this.getArticles = function(section, topic, article, output)
{
var articlesLayout = '';
var articleTemplate = '';
var bylineTemplate = '';
var isArticle = false;
var instance = this;

var searchObject = {object_type: 'article'};
if(section)
{
searchObject.article_sections = section;
}
if(topic)
{
searchObject.article_topics = topic;
}
if(article)
{
var isArticle = true;
searchObject._id = ObjectID(article);
}
searchObject.publish_date = {$lt: new Date()};

getHTMLTemplate('elements/article', [], [], function(data)
{
articleTemplate = data;
getHTMLTemplate('elements/article/byline', [], [], function(data)
{
bylineTemplate = data;

getDBObjectsWithValues(searchObject, function(data)
