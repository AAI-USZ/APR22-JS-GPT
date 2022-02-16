/*

    Index page of the pencilblue theme
    
    @author Blake Callens <blake.callens@gmail.com>
    @copyright PencilBlue 2013, All rights reserved

*/

this.init = function(request, output)
{
    var result = '';
    var instance = this;
    
    getDBObjectsWithValues({object_type: 'user'}, function(data)
    {
        if(data.length == 0)
        {
            output({redirect: SITE_ROOT + '/setup'});
            return;
        }
    
        getSession(request, function(session)
        {
            initLocalization(request, session, function(data)
            {
                getHTMLTemplate('head', 'Home', null, function(data)
                {
                    require('../include/section_map').setSectionMap(data, function(siteSettings, headLayout)
                    {
                        result = result.concat(headLayout);
                        getHTMLTemplate('index', null, null, function(data)
                        {
                            result = result.concat(data);
                            
                            require('../include/articles').getArticles([], [], function(articles)
                            {
                                result = result.split('^articles^').join(articles);
                                
                                require('../include/media').getCarousel(siteSettings.carousel_media, result, '^carousel^', 'index_carousel', function(newResult)
                                {
                                    result = newResult;
                                
                                    getHTMLTemplate('footer', null, null, function(data)
                                    {
                                        result = result.concat(data);
                                        output({cookie: getSessionCookie(session), content: localize(['pencilblue_generic'], result)});
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
