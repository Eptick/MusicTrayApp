var play = document.getElementById("play");
    
    var searchResults = document.getElementById("searchResults");
    var searchButton = document.getElementById("searchButton");
    var searchInput = document.getElementById("searchInput");
    var youtube = new Youtube();
    youtube.setKey(env.apiKey);
    
    searchButton.addEventListener("click",function(){
       var input = searchInput.value; 
       
       youtube.search(input, 10, function(error, result) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(result);
                searchResults.innerHTML = "";
                
                for(var i = 0; i < result.items.length; i++){
                    var item = document.createElement("div");
                    item.className ="searchResult item";
                    item.style.width = "100%";
                    item.style.float = "left";
                    item.setAttribute("video_key", result.items[i].id.videoId);
                    item.innerHTML = result.items[i].snippet.title;
                    item.addEventListener("click",startDownload);
                    searchResults.appendChild(item);   
                }
            }
        });
    }); 