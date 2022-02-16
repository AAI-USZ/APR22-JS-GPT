this.getArticles = function(section, topic, output)
{
var articlesLayout = '';
var articleTemplate = '';
var bylineTemplate = '';
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

getHTMLTemplate('elements/article', [], [], function(data)
{
articleTemplate = data;
getHTMLTemplate('elements/article/byline', [], [], function(data)
{
bylineTemplate = data;

getDBObjectsWithValues(searchObject, function(data)
{
if(data.length == 0)
{
output('^loc_NO_ARTICLES^');
return;
}

var articles = data;
var authorIDs = [];

for(var i = 0; i < articles.length; i++)
{
authorIDs.push({_id: ObjectID(articles[i].author)});
}

getDBObjectsWithValues({object_type: 'user', $or: authorIDs}, function(data)
{
if(data.length == 0)
{
output('^loc_NO_ARTICLES^');
return;
}

authors = data;

for(var i = 0; i < articles.length; i++)
{
var article = articleTemplate.split('^article_headline^').join(articles[i].headline);
article = article.split('^article_subheading^').join('<h3>' + articles[i].subheading + '</h3>');

var byline = '';
for(var j = 0; j < authors.length; j++)
{
if(authors[j]._id.equals(ObjectID(articles[i].author)))
{
byline = bylineTemplate.split('^author_photo^').join((authors[j].photo) ? authors[j].photo : '');
byline = byline.split('^display_photo^').join((authors[j].photo) ? '' : ' display: none');
byline = byline.split('^author_name^').join((authors[j].first_name) ? authors[j].first_name + ' ' + authors[j].last_name : authors[j].username);
byline = byline.split('^author_position^').join((authors[j].position) ? authors[j].position : '');
break;
}
}

article = article.split('^article_byline^').join(byline);
article = article.split('^article_layout^').join(articles[i].article_layout);
articlesLayout = articlesLayout.concat(article);
}

instance.loadMedia(articlesLayout, function(newLayout)
{
output(newLayout);
});
});
});
});
});
}

this.loadMedia = function(articlesLayout, output)
{
var media = require('./media');
var mediaTemplate = '';
var instance = this;

this.replaceMediaTag = function(layout)
{
