

this.init = function(request, output)
{
getSession(request, function(session)
{
if(!userIsAuthorized(session, {logged_in: true, admin_level: ACCESS_EDITOR}))
{
formError(request, session, '^loc_INSUFFICIENT_CREDENTIALS^', '/admin/content/pages', output);
return;
}

var post = getPostParameters(request);

delete post['topic_search'];
delete post['media_search'];
delete post['media_url'];
delete post['media_type'];
delete post['location'];
delete post['thumb'];
delete post['media_topics'];
delete post['name'];
delete post['caption'];
delete post['layout_link_url'];
delete post['media_position'];
delete post['media_max_height'];

post['author'] = session['user']._id.toString();
post['publish_date'] = new Date(post['publish_date']);

session = setFormFieldValues(post, session);

if(message = checkForRequiredParameters(post, ['url', 'headline', 'template', 'page_layout']))
{
formError(request, session, message, '/admin/content/pages', output);
return;
}

var pageDocument = createDocument('page', post, ['meta_keywords', 'page_topics', 'page_media']);

getDBObjectsWithValues({object_type: 'page', url: pageDocument['url']}, function(data)
