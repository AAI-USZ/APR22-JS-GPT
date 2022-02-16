global.getHTMLTemplate = function(templateLocation, pageName, metaDesc, output)
{
var fileLocation = DOCUMENT_ROOT + '/templates/' + templateLocation + '.html';
var instance = this;

this.loadTemplate = function()
{

fs.readFile(fileLocation, function(error, data)
{
if(data)
{
templateString = data.toString();
}
else
{
templateString = '';
}

templateString = templateString.split('^site_name^').join(pb.config.siteName);
templateString = templateString.split('^site_root^').join(pb.config.siteRoot);
if(typeof pageName !== "undefined")
{
templateString = templateString.split('^page_name^').join(' | ' + pageName);
}
else
{
templateString = templateString.split('^page_name^').join('');
