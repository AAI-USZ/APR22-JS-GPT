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
