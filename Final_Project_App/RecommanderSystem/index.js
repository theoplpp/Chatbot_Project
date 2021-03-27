const Readline = require('readline'); // for reading inputs

const rl = Readline.createInterface({ // for reading inputs
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var index_movie = require('./BestMovieChoice.js')
function MoyenneParGenre() {
    return new Promise(async function (resolve, reject) {
        var BestMovie = await index_movie.Data();
        for (var i = 0; i < BestMovie.length; i++) {
            for (var j = 0; j < BestMovie[i].moy_genre.length; j++) {

                BestMovie[i].moy_genre[j].moyenne = parseFloat(BestMovie[i].moy_genre[j].Somme) / parseFloat(BestMovie[i].moy_genre[j].Nombre);
            }
        }
        resolve(BestMovie);
    })

}
async function BestGenreForUser(userId) {
    return new Promise(async function (resolve, reject) {
        TrueUserId = userId - 1;
        var BestMovie = await MoyenneParGenre();

        var max1 = BestMovie[TrueUserId].moy_genre[0].moyenne;
        var max2 = BestMovie[TrueUserId].moy_genre[0].moyenne;;
        var indice = 0;
        var indice1 = 0;
        for (var i = 1; i < BestMovie[TrueUserId].moy_genre.length; i++) {
            if (BestMovie[TrueUserId].moy_genre[i].moyenne > max1) {
                max1 = BestMovie[TrueUserId].moy_genre[i].moyenne
                indice = i;
            }
        }
        for (var i = 1; i < BestMovie[TrueUserId].moy_genre.length; i++) {
            if (BestMovie[TrueUserId].moy_genre[i].moyenne > max2 && BestMovie[TrueUserId].moy_genre[i].moyenne < max1) {
                max2 = BestMovie[TrueUserId].moy_genre[i].moyenne
                indice1 = i;
            }
        }
        console.log("The best genre of user " + userId + " are " + BestMovie[TrueUserId].moy_genre[indice].Genres + " with a moyenne of " + BestMovie[TrueUserId].moy_genre[indice].moyenne + " and " + BestMovie[TrueUserId].moy_genre[indice1].Genres + " with a moyenne of " + BestMovie[TrueUserId].moy_genre[indice1].moyenne + "\n")
        resolve(await SelectMovie(BestMovie[TrueUserId].moy_genre[indice].Genres, BestMovie[TrueUserId].moy_genre[indice1].Genres))

    })
}
async function SelectMovie(BestGenre1, BestGenre2) {
    return new Promise(function (resolve, reject) {
        //console.log(index_movie.Movie)
        const movies =index_movie.Movie
        //var BestMovie=await MoyenneParGenre();
        const result = movies.filter(movie=> movie.genres.includes(BestGenre1) && movie.genres.includes(BestGenre2))
        //console.log(movies[0].genres.includes(BestGenre1 && BestGenre2))
        //console.log(typeof BestGenre1 + BestGenre2)
        //console.log(result)
        resolve(result);
    })
}
async function getgrade(title){
    return new Promise(function(resolve,reject){
        const movies =index_movie.Movie
        const result = movies.filter(movie => movie.title.includes(title))
        id = result[0].movieId
        grades = []
        const rate = index_movie.rate
        rate.forEach(note => {
            if(note.movieId == id)
            {
                grades.push(parseInt(note.rating))
            }
        })
        console.log("I'm calculing the average for the movie: "+ result[0].title)
        moyenne = grades.reduce((a,b) => a+b,0)/grades.length
        grades.push(moyenne)
        resolve(grades)
    })
    
}
async function checkgender(title){
    return new Promise(function(resolve,reject){
        const movies=  index_movie.Movie
        const result = movies.filter(movie => movie.title.includes(title))
        resolve(result);
    })
}

const PropositionFilm = function (userId, NumberMovie) {
    return new Promise(async function (resolve, resject) {
        var Film = await BestGenreForUser(userId);
        var reponse = "Here is a list of Movie that you might like :\n"
        for (var i = 0; i < NumberMovie; i++) {
            var NombreAleatoire = Math.floor(Math.random() * Math.floor(Film.length))
            reponse += "\n" + Film[NombreAleatoire].title
        }
        //console.log(reponse);
        resolve(reponse);
    })

}

const MovieForNewUser = function (BestGenre1, BestGenre2, NumberMovie) {
    return new Promise(async function (resolve, reject) {
        var reponse = "Here is a list of Movie that you might like :\n"
        var Film = await SelectMovie(BestGenre1, BestGenre2);
        for (var i = 0; i < NumberMovie; i++) {
            var NombreAleatoire = Math.floor(Math.random() * Math.floor(Film.length))
            reponse += "\n" + Film[NombreAleatoire].title
        }
        //console.log(reponse);
        resolve(reponse);
    })
}
module.exports =
{
    OldUser: PropositionFilm,
    NewUser: MovieForNewUser,
    gender:checkgender,
    grade:getgrade
}
