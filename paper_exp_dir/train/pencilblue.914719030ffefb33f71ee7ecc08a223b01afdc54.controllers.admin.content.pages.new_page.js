

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
