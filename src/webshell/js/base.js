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
        model: CardModel,
        upload: function(attributes, options){
            var self = this;
            if(window.FormData) {
                var data = new FormData();
                $.each($(attributes.selector_photo)[0].files, function(i, file) {
                    data.append('photo', file);
                });
                data.append("description", $(attributes.selector_description).val());
                $.ajax({
                    url: self.url,
                    type: "POST",
                    data: data,
                    cache: false,
                    contentType: false,
                    dataType: 'json',
                    processData: false,
                    success: function (data) {
                        if(options.success){
                            options.success.apply(self, arguments);
                        }
                        console.log("success ", arguments)
                    },
                    error: function () {
                        console.log("Upload failed ", arguments)
                    }
                })
            } else console.error("Browser doesn't support async file transactions.")
        }
    });

    document.CardModel = CardModel;
    document.CardCollection = CardCollection;
    // TODO: Views
})(jQuery, _, window.document, window);
var host = "localhost:8080";
$(document).ready(function(){

    var container = $('div.gallery').append('<ul></ul>').children();
    var template = function (source, description, id){
        var li = $('<li></li>');
        var thumbnail = $('<span class="thumbnail"></span>');
        var th_img = $('<img class="thumbnail-img"/>');
        var actions = $('<span class="actions"></span>');
        var rel = $('<a rel="prettyPhoto[main]"><i class="glyphicon glyphicon-search"></i></a>');
        var rem = $('<a href="#"><i class="glyphicon glyphicon-remove"></i></a>');
        var src_string = 'data:image/png;base64, '+source;

        th_img.attr('src', src_string);
        th_img.attr('alt', "#"+id);
        rel.children().attr('alt', '#'+id);
        rel.attr('href', src_string);
        rel.attr('title', description);
        actions.append(rel);
        actions.append(rem);
        thumbnail.append(th_img);
        li.append(thumbnail);
        li.append(actions);

        rem.on('click', function(){
            var el = $(this).parent().parent();
            el.animate({opacity: 0}, 400, null, function(){el.remove()});

        });


        return li;
    };

    var modal = $('#uploadModal');
    modal.modal({
        show: false
    });
    
    var file_input = $('#photo');
    var text_input = $('#description');
    var preview_photo = $('#preview-photo');
    var last_preview_blob = "";
    file_input.on('change', function(){
       if(file_input[0].files.length){
           var file = $(file_input)[0].files.item(0);
           var freader = new FileReader();
           freader.onload = function(data){
               preview_photo.attr('src', data.target.result);
               preview_photo.fadeIn(400);
               last_preview_blob = data.target.result;
           };
           freader.readAsDataURL(file);
       } else {
           preview_photo.removeAttr('src');
           preview_photo.hide();
           last_preview_blob = "";
       }
    });
    var getFeeds = function(){
        var result = new document.CardCollection({},{host: host, protocol: "http"});
        result.fetch().done(function(){
            $('#big-loader').hide();
            for(var el in result.models) {
                var model = result.models[el];
                container.prepend(template(model.get('url'), model.get('description'), model.id || model.cid));
                $("a[rel^='prettyPhoto']").prettyPhoto();
            }
        });

        return result;
    };
    var Collection = getFeeds();

    var upload_btn = $('#modal-upload-btn');
    upload_btn.on('click', function(e){
        e.preventDefault();
        Collection.upload({selector_photo: file_input, selector_description: text_input},
            {success: function(){
                modal.modal('hide');
                try{
                    last_preview_blob = last_preview_blob.split(',')[1];
                } catch(e){
                    last_preview_blob = "";
                }
                if(last_preview_blob.length){
                    container.prepend(template(last_preview_blob, text_input.val(), null));
                    $("a[rel^='prettyPhoto']").prettyPhoto();
                    Collection.add({
                        url: last_preview_blob,
                        description: text_input.val()
                    });
                }
                file_input.val(null);
                text_input.val("");

            }})
    });

    var refresh_btn = $('#refresh-btn');
    refresh_btn.on('click', function(){
        container.children().remove();
        $('#big-loader').show();
        Collection = getFeeds();
    });
});