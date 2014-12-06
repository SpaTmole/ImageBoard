(function($, _, document, window){
    var AlbumView, CardView, PostFormView;
    var CardCollection, CardModel;

    CardModel = Backbone.Model.extend({
        defaults: {
            description: null,
            id: null,
            url: null
        }
    });

    CardCollection = Backbone.Collection.extend({
        initialize: function(attributes, options){
            this.url = options.protocol + "://" + options.host + "/rest/card/";
        },
        model: CardModel
    });

    document.CardModel = CardModel;
    document.CardCollection = CardCollection;
    // TODO: Views
})(jQuery, _, window.document, window);
var host = "localhost:8080";
$(document).ready(function(){
    var carousel = $('.carousel');
    carousel.carousel({interval: 0});
    $('.left.carousel-control').on('click', function(){
       carousel.carousel('prev');
    });
    $('.right.carousel-control').on('click', function(){
        carousel.carousel('next');
    });

    var Collection = new document.CardCollection({},{host: host, protocol: "http"});
    Collection.fetch().done(function(){
        $('#big-loader').hide();
        $('#content-keeper').fadeIn(400);
        for(var el in Collection.models){
            var item = $('<div class="item"></div>'),
                img = $('<img class="carousel-img">'),
                caption = $('<div class="carousel-caption"></div>');
            img.attr("src", 'data:image/png;base64, ' + Collection.models[el].get('url'));
            caption.text(Collection.models[el].get('description'));
            item.append(img, caption);
            var indicator = $('<li data-target="#main-container"></li>');
            indicator.data({
                'slide-to': el
            });
            indicator.on('click', function(){
                carousel.carousel(Number($(this).data('slide-to')));
            });
            if(el == 0){
                item.addClass('active');
                indicator.addClass('active');
            }
            $('.carousel-inner').append(item);
            $('ol.carousel-indicators').append(indicator);
        }
    });
});