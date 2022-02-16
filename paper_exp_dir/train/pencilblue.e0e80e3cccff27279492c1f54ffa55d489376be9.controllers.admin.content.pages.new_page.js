

this.init = function(request, output)
{
var result = '';
var instance = this;

getSession(request, function(session)
{
if(!userIsAuthorized(session, {logged_in: true, admin_level: ACCESS_EDITOR}))
{
output({content: ''});
return;
}

session.section = 'pages';
session.subsection = 'new_page';

initLocalization(request, session, function(data)
{
getHTMLTemplate('admin/content/pages/new_page', null, null, function(data)
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

instance.getTopicOptions(function(topicsList)
{
result = result.split('^topic_options^').join(topicsList);

instance.getMediaOptions(function(mediaList)
{
result = result.split('^media_options^').join(mediaList);

prepareFormReturns(session, result, function(newSession, newResult)
{
session = newSession;
result = newResult;

editSession(request, session, [], function(data)
{
output({content: localize(['admin', 'pages', 'articles', 'media'], result)});
});
});
});
});
});
});
});
});
});
}

