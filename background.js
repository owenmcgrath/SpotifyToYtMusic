chrome.webRequest.onBeforeRequest.addListener(
	function(details)
	{
		if(details.url.startsWith("https://open.spotify.com")) 
		{
			console.log(details.url);

			req = new XMLHttpRequest();
			const authUrl = "https://accounts.spotify.com/api/token";
			const clientString = "Yzc4ODk5Yjg4ZDc3NGMwNGIwYTllNzJiMjU0MmZhN2Q6YmUwZjdlODk2ZmNmNDM3ZTlhNmI4YWU1ZmRhNWMxMjE="
			req.open("POST", authUrl);
			req.setRequestHeader("authorization", "Basic " + clientString);
			req.setRequestHeader("content-type", "application/x-www-form-urlencoded");
			req.addEventListener("readystatechange", function()
			{
				if(this.readyState == 4)
				{
					console.log(this.responseText);
					var authObj = JSON.parse(this.responseText)
					
					var SPOTIFY_TOKEN = authObj.access_token;
					console.log(SPOTIFY_TOKEN);
					const trackReq = new XMLHttpRequest();
					const baseUrl = "https://api.spotify.com/v1/tracks/";
					const id = details.url.substring(details.url.lastIndexOf("/") + 1, details.url.lastIndexOf("?"));
					console.log(id);
					trackReq.open("GET", baseUrl + id);
					trackReq.setRequestHeader("accept", "application/json");
					trackReq.setRequestHeader("content-type", "application/json");
					trackReq.setRequestHeader("authorization", "Bearer " + SPOTIFY_TOKEN);

					trackReq.addEventListener("readystatechange", function() 
					{
						if(this.readyState == 4)
						{
							console.log(this.responseText);
							var resp = JSON.parse(this.responseText); 
							var artist = resp.artists[0].name.split(" ").join("+");
							var songTitle = resp.name.split(" ").join("+");
							artist = artist.replace(/,/g, "");
							songTitle = songTitle.replace(/,/g, "");
							var retUrl = "https://music.youtube.com/search?q=" + artist + "+" + songTitle;
							chrome.tabs.update({url: retUrl});
						}
					});
					var data = null;
					trackReq.send(data);
				}
			});


			req.send("grant_type=client_credentials");


		}	
	},
	{
		urls: ["https://open.spotify.com/track/*"]
	},
	['blocking']
);