$(document).ready(function()
{
$('#new_article_form').validate(
{
rules:
{
url:
{
minlength: 2,
required: true
},
template:
{
required: true
}
}
});

if($('#publish_date').val().length == 0)
{
setPublishDateToNow();
}

$('#publish_date').datetimepicker(
{
language: 'en',
format: 'Y-m-d H:m'
});

$('#url').focus();
});

function setPublishDateToNow()
{
var date = new Date();
