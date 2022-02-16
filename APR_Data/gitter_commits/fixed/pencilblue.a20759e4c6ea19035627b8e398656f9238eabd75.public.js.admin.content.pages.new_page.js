/*

    Interface for adding a new page
    
    @author Blake Callens <blake.callens@gmail.com>
    @copyright PencilBlue 2013, All rights reserved

*/

var formRefillOptions =
[
    {
        id: 'publish_date',
        type: 'datetime'
    },
    {
        id: 'page_layout',
        type: 'layout'
    },
    {
        id: 'page_media',
        type: 'drag_and_drop',
        elementPrefix: 'media_',
        activeContainer: '#active_media'
    },
    {
        id: 'page_topics',
        type: 'drag_and_drop',
        elementPrefix: 'topic_',
        activeContainer: '#active_topics'
    }
];

$(document).ready(function()
{
    $('#new_page_form').validate(
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
    $('#publish_date').val(getDatetimeText(date));
}

function getDatetimeText(date)
{
    var datetime = date.getFullYear() + '-' + getExtraZero(date.getMonth() + 1) + '-' + getExtraZero(date.getDate()) + ' ';
    datetime += getExtraZero(date.getHours()) + ':' + getExtraZero(date.getMinutes());
    
    return datetime;
}

function getExtraZero(dateNumber)
{
    if(dateNumber < 10)
    {
        dateNumber = '0' + dateNumber;
    }
    
    return dateNumber;
}

function checkForNewPageSave()
{
    // We need to remove other fieldsets so the form data isn't duplicated
    $('.modal-body fieldset').remove();

    buildTopics(function(topicsCSV)
    {
        if(!$('#page_topics').position())
        {
            $('fieldset').append('<input type="text" id="page_topics" name="page_topics" value="' + topicsCSV + '" style="display: none"></input>');
        }
        else
        {
            $('#page_topics').val(topicsCSV);
        }
        
        buildMedia(function(mediaCSV)
        {
            if(!$('#page_media').position())
            {
                $('fieldset').append('<input type="text" id="page_media" name="page_media" value="' + mediaCSV + '" style="display: none"></input>');
            }
            else
            {
                $('#page_media').val(mediaCSV);
            }
        
            $('fieldset').append('<textarea id="page_layout" name="page_layout" style="display: none">' + $('#layout_editable').html() + '</textarea>');
            
            $('#new_page_form').submit();
        });
    });
}

function buildTopics(output)
{
    var topicElements = $('#active_topics').find('.topic');
    topicElementCount = 0;
    topicsArray = [];
    
    if(topicElements.length == 0)
    {
        output('');
        return;
    }
    
    topicElements.each(function()
    {
        topicsArray.push($(this).attr('id').split('topic_').join('').trim());
        
        topicElementCount++;
        if(topicElementCount >= topicElements.length)
        {
            output(topicsArray.join(','));
        }
    });
}

function buildMedia(output)
{
    var mediaElements = $('#active_media').find('.col-md-3');
    mediaElementCount = 0;
    mediaArray = [];
    
    if(mediaElements.length == 0)
    {
        output('');
        return;
    }
    
    mediaElements.each(function()
    {
        mediaArray.push($(this).attr('id').split('media_').join('').trim());
        
        mediaElementCount++;
        if(mediaElementCount >= mediaElements.length)
        {
            output(mediaArray.join(','));
        }
    });
}
