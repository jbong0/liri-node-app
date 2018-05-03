require("dotenv").config()

// program keys
var keys = require("./keys.js")
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify)
var Twitter = require("twitter")
var client = new Twitter(keys.twitter)
var omdb = require("omdb")

// takes program commands
var programToRun = process.argv[2]
var searchTerm = process.argv.slice(3)

// vars for FS
var programData
var fs = require("fs")
var logProgram = "Program Ran: " + programToRun + "\n \n"
var logSearch = "Search Term: " + searchTerm + "\n"
var lineBreak = "\n----------------------\n"

// takes in argv and runs user specified program with key commands
if(programToRun === "my-tweets"){
    myTweets()
} else if (programToRun === "spotify-this-song"){
    spotifyThisSong()
} else if (programToRun === "movie-this"){
    movieThis()
} else if (programToRun === "do-what-it-says"){
    doWhatItSays()
} else {
    console.log("You need to specify a program!")
}

// Run twitter/"my-tweets" program
function myTweets(){
    var params = {screen_name: 'jbongobongo'};
    console.log("\n Most Recent Tweets:" + lineBreak)
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++){
                if (tweets[i].text !== undefined){
                    programData = ( tweets[i].created_at + "\n" + tweets[i].text + "\n")
                    console.log(programData)
                }

                // stores programData to "log.txt"
                fs.appendFile("log.txt", lineBreak + logProgram + "Program Data: " + programData, function(data,err){
                    if (err){
                        console.log(err)
                    } 
                })
            }
        }
        console.log(lineBreak + "\nRecent tweets have been saved. \n")           
    });
}
// End Twitter Program ////////////////////////


// Run spotify/"spotify-this-song" program
function spotifyThisSong(){
    spotify.search({ type: 'track', query: searchTerm }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var programData = (`
        ${"Artist: " +  data.tracks.items[0].album.name}
        ${"Song: " + data.tracks.items[0].name}
        ${"Song URL: " + data.tracks.items[0].album.external_urls.spotify}
        ${"Album: " + data.tracks.items[0].artists[0].name}
        `)

        
        fs.appendFile("log.txt", lineBreak + logProgram + "Program Data: " + programData, function(data,err){
            if (err){
                console.log(err)
            } else{
                console.log("Spotify command has been saved.")
                console.log(programData)
            }
        })
    });
}
/////////////////End Spotify program

// run OMDB/"movie-this" program
function movieThis(){
    console.log("running movie-this")
    omdb.search('saw', function(err, movies) {
        if(err) {
            return console.error(err);
        }
        if(movies.length < 1) {
            return console.log('No movies were found!');
        }
        movies.forEach(function(movie) {
            console.log('%s (%d)', movie.title, movie.year);
        });
    });
     
    omdb.get({ title: 'Saw', year: 2004 }, true, function(err, movie) {
        if(err) {
            return console.error(err);
        }
     
        if(!movie) {
            return console.log('Movie not found!');
        }
        console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
        console.log(movie.plot);
    });
    
}

// run my/"do-what-it-says" program
function doWhatItSays(){
    console.log("running do what it says")
    // read
    programData = ("Movies!")
    searchTerm = ("None")
}


