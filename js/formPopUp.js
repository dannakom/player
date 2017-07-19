class formPopUp extends Popup {
	constructor () {
		console.time('FormPopup')
		super(null);
	}
checkPhotoURL(photo){
        console.log(photo.val());
    }
	build () {
		super.build();
                $('<h1>',{text:'Add new Playlist'}).appendTo(this.popup.find('#popup_container'));
                var form_container=$('<div>',{
                    id:'form_container',
                }).appendTo(this.popup.find('#popup_container'));            
                var photo=$('<img>',{ 
                    class:"img", 
                    src:"img/default.jpg",
                    alt:"default",
                    width:"224",
                    height:"228"
                }).appendTo(this.popup.find('#popup_container'));
		
		this.sendAjax('views/AddAlbum.html')
		.then(function (data) {
                    var html = data[0];         
                    form_container.html(html);
                    var photo=form_container.find('form').find('input[name=photo]');
                    photo.keydown(function (e) {
                        this.checkPhotoURL(photo);			
                    }.bind(this));
		}.bind(this))
                .then(function () {
                    return new Promise(function (resolve) {
                        form_container.submit(function(e) {
                            e.preventDefault();
                            console.log("hhhhhhhhhhh");
                            resolve(e);
                            });
			})
		}).then(function (e) {
			console.log(e.target);
                        var content = $(e.target).parent();
	$(e.target).remove();
	console.log(content);
              }.bind(this));
//                    albums_container.append(buildAlbum(index, val));
//                 }); 
//                        var data = {
//				name: $(e.target).find('input:first-child').val(), 
//				password: $(e.target).find('input:nth-child(2)').val(), 
//			};
//			// throw new RangeError('sdfsdfsd');
//			return this.sendAjax('main.php', 'POST', data);
		
//		.then(function (data) {
//			console.log(data);
//			var xhr = data[2];
//			if (xhr.statusText === 'Created') {
//				this.remove();
//			}
//		}.bind(this))
//		.catch(function (err) {
//			console.log(err)
//		})
	}
    
    
    
    addSongs(form) {
	var content = form.parent();
	form.remove();
	console.log(content);
	$.get('songs.html', function(data) {
		content.html(data);
		for (var i = 0; i < 3; i++) {
			addSong().prependTo(content.find('form'));
		}

		content.find('.add-song').click(function(event) {
			addSong().insertAfter(content.find('form fieldset:last-of-type'));
		});

		content.find('form').submit(function(event) {
			event.preventDefault();
			newPlaylistObject.songs = [];
			$(event.target).find('fieldset').each(function(index, el) {
				var song = {};
				song.url = $(el).find('.song-name input:not(:placeholder-shown)').val();
				newPlaylistObject.songs.push(song);
			});
			console.log(newPlaylistObject);
		});
	});
    }
	 addSong() {
		var fieldset = $('<fieldset>');
		
		var songNameLabel = $('<label>', {
			class: "song-name", 
		}).appendTo(fieldset);
		$('<span>', {text: "Song URL"}).appendTo(songNameLabel);
		$('<input>', {
			type: "text", 
			placeholder: "song url", 
		}).appendTo(songNameLabel);

		return fieldset;
	}
    
	sendAjax(url, method, data) {
		console.log(arguments);
		method = method || 'GET';
		return new Promise(function (resolve, reject) {
			$.ajax({
				url: url,
				type: method,
				data: data,
				success: function (data, textStatus, jqXHR) {
					resolve([data, textStatus, jqXHR]);
				}, 
			})			
		})
	}
}