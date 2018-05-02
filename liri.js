
// LIRI Commands (* `my-tweets * `spotify-this-song` * `movie-this` * `do-what-it-says`)
require("dotenv").config()

// retrieves keys
var keys = require("./keys.js")

// spotify keys
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);

// twitter keys
var Twitter = require("twitter")
var client = new Twitter(keys.twitter);

// takes process.argv[2] input to run program
var programToRun = process.argv[2]

// creates process.argv[3] as a string
var searchTerm = process.argv.slice(3)

// program key commands
if(programToRun === "my-tweets"){
    myTweets()
} else if (programToRun == "spotify-this-song"){
    spotifyThisSong()
} else if (programToRun == "movie-this"){
    movieThis()
} else if (programToRun == "do-what-it-says"){
    doWhatItSays()
} else {
    console.log("You need to specify a program!")
}

// twitter program function
function myTweets(){
    var params = {screen_name: 'jbongobongo'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 5; i++){
                if (tweets[i].text !== undefined){
                    console.log(tweets[i].created_at); 
                    console.log(tweets[i].text);
                    console.log("\n----------")
                }
            }
        }
    });     

}

// spotify program function
function spotifyThisSong(){
    spotify.search({ type: 'track', query: searchTerm }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        var songName = data.tracks.items[0].name
        var albumName = data.tracks.items[0].album.name
        var artistName = data.tracks.items[0].artists[0].name
        var trackURL = data.tracks.items[0].album.external_urls.spotify

        console.log(` 
        ${"Song: " + songName}
        ${"Artist: " + artistName}
        ${"Album: " + albumName}
        ${"Song URL: " + trackURL}
        ${" "}
        `)
      });
}

// OMDB program functions
function movieThis(){
    console.log("running movie-this")
}

// Do what it says program function
function doWhatItSays(){
    console.log("running do what it says")
}

