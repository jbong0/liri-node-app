require("dotenv").config()
var keys = require("./keys.js")
var fs = require("fs")
var request = require("request")
var omdb = require("omdb")
var Spotify = require("node-spotify-api")
var Twitter = require("twitter")

// takes program commands
var programToRun = process.argv[2]
var searchTerm = process.argv.slice(3) 

// styling variables
var programData
var lineBreak = "\n----------------------"

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
    var client = new Twitter(keys.twitter)
    var params = {screen_name: 'jbongobongo'};
    console.log("\n Most Recent Tweets:" + lineBreak)
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++){
                if (tweets[i].text !== undefined){
                    programData = ( tweets[i].created_at + "\n" + tweets[i].text + "\n")
                    console.log(programData)
                }
            appendInfo(programData)
            }
        }
        console.log(lineBreak + "\n\nRecent tweets saved. \n")           
    })
}
// End my-tweets ////////////////////////

// Run spotify/"spotify-this-song" program
function spotifyThisSong(){
    var spotify = new Spotify(keys.spotify)
    console.log("\nMusic Search:" + lineBreak)
    spotify.search({ type: 'track', query: searchTerm }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        var programData = (`
        ${"Artist: " +  data.tracks.items[0].artists[0].name}
        ${"Song: " + data.tracks.items[0].name}
        ${"Song URL: " + data.tracks.items[0].album.external_urls.spotify}
        ${"Album: " + data.tracks.items[0].album.name}
        `)
        appendInfo(programData)
        console.log(programData)
        console.log(lineBreak + "\n\nMusic search saved. \n")  
    })
}
//End spotify-this-song ////////////////////////

// run OMDB/"movie-this" program
function movieThis(){
    console.log("\nMovie Search: " + lineBreak)
    var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy";
    
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {

          programData = (`
            ${"Movie Title: " + JSON.parse(body).Title}
            ${"Release Year: " + JSON.parse(body).Year}
            ${"IMDB Rating: " + JSON.parse(body).imdbRating}
            ${"Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value}
            ${"Produced in: " + JSON.parse(body).Country}            
            ${"Movie Launguage: " + JSON.parse(body).Language}
            ${"Movie Plot: " + JSON.parse(body).Plot}
            ${"Actors: " + JSON.parse(body).Actors}
            `)
        }
        console.log(lineBreak + "\n\nMovie search saved. \n") 
        appendInfo(programData)
    })
}
//End movie-this ////////////////////////

//Run my/"do-what-it-says" program
function doWhatItSays(){
    console.log("\nRandom Command:")
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error)
        }
        console.log("node " + data)
        var dataArr = data.split(",")

        searchTerm = dataArr[1]
        spotifyThisSong()
    })
}
//End "do-what-it-says ////////////////////////"

// Run appendInfo
function appendInfo(programData){
    var logProgram = "\n\LIRI Command:\n " + programToRun + "\n \n"

    // stores programData for each program to "log.txt"
    fs.appendFile("log.txt", lineBreak + logProgram + "Program Data: " + programData, function(data,err){
        if (err){
            console.log(err)
        } 
    })
}
//End appendInfo////////////////////////

