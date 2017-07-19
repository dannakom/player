
$( document ).ready(function() {
    ajax(null,"api/playlist",'GET')
            .then(function(data) {
           //     data.data['0'].id;
                //var myJSON = JSON.stringify(data);
                console.log(data.data);
               buildPlaylist(data);
    });
});


function buildAlbum(index,val){
      
    var palyList=$('<div>',{
             class:"playList"
    });           

    var item=$('<div>',{
             class:"playItem",
             "data-id":index,
             css:{"background-image": 'url(img/'+val.image+')'},
    }).appendTo(palyList);

    var albumContainer =$('<span>',{
        class:"albumContainer",
    }).appendTo(item);

     var name =$('<h1>',{
        text:val.name
    }).appendTo(albumContainer);
    name.circleType({ radius: 170});


    var playItemSmall=$('<span>',{
        class:"playItemSmall"
    }).appendTo(item);

    var playIcon=$('<button>',{
        class:"playIcon",
    }).appendTo(playItemSmall);
    playIcon.click({param1: index},playAlbum);
    return palyList;
}      


function buildPlaylist(data){
      // console.log("hi");
      
    var main_Container=$('#Maincontainer');
    var header=$('#header_container');

    var add_container=$('<div>',{
        class:'add_container'
    }).appendTo(header);

    var add=$('<button>',{
        id:'add_btn',
        click:addAlbum,
    }).appendTo(add_container);

    var addSymbol=$('<i>',{
        text:'Add new playlist',
        class:" addSymbol fa fa-plus-circle",
        css:{"aria-hidden": 'true'},
    }).appendTo(add);
       
    var search_container =$('<div>',{
        class:'search_container dropdown'
    }).appendTo(header);
        
    var search_icon =$('<span>',{
        class:'search_icon'
    }).appendTo(search_container);
       
    var a=$('<a>',{
        href:"#" ,
        class:'dropdown-toggle'
    }).appendTo(search_container);
 
    var search=$('<input>',{
        type:'search', 
        placeholder:"Search...",
        'data-toggle':"dropdown",
        class:'search_btn',  
        text:"Search Playlist",
    }).appendTo(a);
    
    var searchLi = $('<ul>',{class:'mylist dropdown-menu'}).appendTo(search_container);
    var albums=createSearchList(data);
    
    search.keyup(function() {
        serchplaylist(this.value,albums);
      
   })
   
    var searchSymbol=$('<i>',{
           class:"fa fa-search",
           css:{"aria-hidden": 'true'},
        }).appendTo(search_icon);
       
        var albums_container=$('<div>',{
           id:'albums_container'
        }).appendTo(main_Container); 
       
        $.each(data.data, function(index, val) {
            albums_container.append(buildAlbum(index, val));
         }); 
     }

    function playAlbum(event){
        console.log(event.data.param1); 
        var albumInfo =  ajax(null,"api/playlist/"+(event.data.param1+1)+"",'GET');
        var songsList = ajax(null,"api/playlist/"+(event.data.param1+1)+"/songs",'GET');
        console.log(albumInfo); 
        Promise.all([albumInfo, songsList]).then(values => { 
            console.log(values); 
           
            f(values);
        });
    }
 function f(input){
         ajax(null,"playsong.html",'GET')
            .then(function(data) {
                var container=$('#albums_container');
            container.empty(); 
            container.html(data);
            console.log(input[0].data.image);
            $('#grey_Circle_remove').click(removeAlbum);
            $('#grey_Circle_edit').click(editAlbum);
            $('#info').text("NOW PLAYING :"+input[1].data.songs[0].name)
            var item=$('.playItemC');
            item.css("background-image", 'url(img/'+input[0].data.image+')');
            item.click(playPause);
            $.each(input[1].data.songs, function(index, val) {
                $('#songList').append(addLi(index, val));
         }); 
        
    });
 }
 
 function addLi(index,val){
    var i=$('<i>',{
        class:'fa fa-play',
        css:{"font-size":'16px'}
    });
    var li=$('<li>',{
        text:val.name,
        tabindex:index,
        
        click:function (e) {
            replaceSong(e,val);	
        },
    });    
    
    if(index == 0){
        li.addClass("nostyle");
        li.appendTo(i);
        return i;
    } 
    else{
        li.addClass("songItem");
    }
    
    return li;
     
 }
 
 function replaceSong(even,val){
     console.log(val);
     var audio=$('#audioPlay'); 
     $('#song_source').attr("src",val.url);
     audio[0].pause();
     audio[0].load();
     audio[0].oncanplaythrough = audio[0].play();
      $('#info').text("NOW PLAYING :"+val.name)
     
 }
 
 
 function playPause(){        
     var audio=$('#audioPlay');  
  if (audio[0].paused == false) {
      audio[0].pause();
      $('.playItemSmallC').empty();
      $('.playItemSmallC').empty();
      $('<i>',{
        class:'fa fa-play',
        css:{"font-size":'32px'}
      }).appendTo($('.playItemSmallC'));
      $('.playItemC').css("animation-play-state"," paused");
  } else {
        audio[0].play();
        $('.playItemSmallC').empty();
        $('.playItemSmallC').empty();
        $('<i>',{
            class:'fa fa-pause',
            css:{"font-size":'32px'}
            }).appendTo($('.playItemSmallC'));
        $('.playItemC').css("animation-play-state"," running")
  }

            
                
 }
    function serchplaylist(input,albums){
        if(input==''){
            $( "li" ).css( "display", "none" );     
        }
        else{
            $( "li" ).filter(function() {$(
                "li:contains("+input+")").css( "display", "block" );
            });
            $("li:not(:contains("+input+"))").css("display", "none");
        }
    }

    function createSearchList(data){

        var albums=[];
            $.each(data.data, function(index, val) {
            albums[index]=val.name;
        }); 

        var s=$('.mylist');
        $.each(albums, function(i)
        {
            var li = $('<li/>')
            .addClass('ui-menu-item')
            .attr('role', 'menuitem')
            .appendTo(s);
            var aaa = $('<a/>')
            .addClass('ui-all')
            .text(albums[i])
            .appendTo(li);
        });
       return albums; 
    }
    
    function addAlbum(){

        var popup = new formPopUp();
        popup.build();

    }
    
    function ajax(data,url,method) {
            
        data   = data  || null;
        return new Promise(function (resolve) {
            $.ajax({
                type: method,
                url: url, 
                data: data,
                success: function (response) {
//                console.log(response);	
                    resolve(response);
                }
            });
        })
    }