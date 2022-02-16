

this.init = function(request, output)
{
var result = '';
var instance = this;

getSession(request, function(session)
{
if(!userIsAuthorized(session, {logged_in: true, admin_level: ACCESS_WRITER}))
{
output({content: ''});
return;
}

session.section = 'article';
session.subsection = 'new_article';

initLocalization(request, session, function(data)
{
getHTMLTemplate('admin/content/articles/new_article', null, null, function(data)
{
result = result.concat(data);

var tabs =
[
{
active: true,
href: '#content',
icon: 'quote-left',
title: '^loc_CONTENT^'
},
{
href: '#media',
icon: 'camera',
title: '^loc_MEDIA^'
},
{
href: '#sections_dnd',
icon: 'th-large',
title: '^loc_SECTIONS^'
},
{
href: '#topics_dnd',
icon: 'tags',
title: '^loc_TOPICS^'
},
{
href: '#meta_data',
icon: 'tasks',
title: '^loc_META_DATA^'
}
];

getTabNav(tabs, function(tabNav)
{
result = result.split('^tab_nav^').join(tabNav);

instance.getTemplateOptions(function(templatesList)
{
result = result.split('^template_options^').join(templatesList);

instance.getSectionOptions(function(sectionsList)
{
result = result.split('^section_options^').join(sectionsList);

instance.getTopicOptions(function(topicsList)
{
result = result.split('^topic_options^').join(topicsList);

instance.getMediaOptions(function(mediaList)
{
result = result.split('^media_options^').join(mediaList);

displayErrorOrSuccess(session, result, function(newSession, newResult)
{
session = newSession;
result = newResult;

checkForFormRefill(result, session, function(newResult, newSession)
{
session = newSession;
result = newResult;

editSession(request, session, [], function(data)
{
output({content: localize(['admin', 'articles', 'media'], result)});
});
});
});
});
});
});
});
});
