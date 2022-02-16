

this.init = function(request, output)
{
getSession(request, function(session)
{
if(!userIsAuthorized(session, {logged_in: true, admin_level: ACCESS_WRITER}))
{
formError(request, session, '^loc_INSUFFICIENT_CREDENTIALS^', '/admin/content/articles', output);
return;
}

var post = getPostParameters(request);

delete post['section_search'];
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

if(message = checkForRequiredParameters(post, ['url', 'template', 'article_layout']))
{
formError(request, session, message, '/admin/content/articles', output);
return;
}

var articleDocument = createDocument('article', post, ['meta_keywords', 'article_sections', 'article_topics', 'article_media']);
