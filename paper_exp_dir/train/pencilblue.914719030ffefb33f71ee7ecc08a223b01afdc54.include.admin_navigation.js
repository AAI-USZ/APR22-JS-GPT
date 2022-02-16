global.getAdminNavigation = function(session, activeMenuItems, output)
{
var adminNavigation = removeUnauthorizedAdminNavigation(session, defaultAdminNavigation);
var buttonTemplate = '';
var dropdownTemplate = '';
var navLayout = '';

getHTMLTemplate('admin/elements/admin_nav/button', null, null, function(data)
{
buttonTemplate = data;

getHTMLTemplate('admin/elements/admin_nav/dropdown', null, null, function(data)
{
dropdownTemplate = data;

for(var i = 0; i < adminNavigation.length; i++)
{
if(typeof adminNavigation[i].children === 'undefined')
{
navLayout = navLayout.concat(getAdminNavigationItem(buttonTemplate, adminNavigation[i], activeMenuItems));
}
else
{
var dropdown = getAdminNavigationItem(dropdownTemplate, adminNavigation[i], activeMenuItems);
var items = '';
for(var j = 0; j < adminNavigation[i].children.length; j++)
{
items = items.concat(getAdminNavigationItem(buttonTemplate, adminNavigation[i].children[j], activeMenuItems));
}

dropdown = dropdown.split('^children^').join(items);
navLayout = navLayout.concat(dropdown);
}
}

output(navLayout);
});
});
}

global.removeUnauthorizedAdminNavigation = function(session, adminNavigation)
{
for(var i = 0; i < adminNavigation.length; i++)
{
if(typeof adminNavigation[i].access !== 'undefined')
{
if(!userIsAuthorized(session, {admin_level: adminNavigation[i].access}))
{
adminNavigation.splice(i, 1);
i--;
continue;
}
}

if(typeof adminNavigation[i].children !== 'undefined')
{
for(var j = 0; j < adminNavigation[i].children.length; j++)
{
if(typeof adminNavigation[i].children[j].access !== 'undefined')
{
if(!userIsAuthorized(session, {admin_level: adminNavigation[i].children[j].access}))
{
adminNavigation[i].children.splice(j, 1);
j--;
continue;
}
}
}
}
}

return adminNavigation;
}

global.getAdminNavigationItem = function(template, itemData, activeItems)
{
var active = '';
for(var i = 0; i < activeItems.length; i++)
{
if(activeItems[i] == itemData.id)
{
active = 'active';
break;
}
}

if(itemData.href.substr(0, 1) == '#')
{
var href = itemData.href;
}
else if(itemData.href.indexOf('http://') > -1 || itemData.href.indexOf('https://') > -1)
{
var href = itemData.href;
}
else
{
var href = pb.config.siteRoot + itemData.href;
}

var item = template.split('^nav_icon^').join(itemData.icon);
item = item.split('^nav_title^').join(itemData.title);
item = item.split('^nav_active^').join(active);
