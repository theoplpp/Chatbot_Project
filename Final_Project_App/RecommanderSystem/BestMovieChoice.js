const fs =require('fs');
const csv =require('fast-csv');


let movies_data = [];
let MIX = [];
let note = [];
let moy_genre = [];
let moy_genre_pers = [];


function MoyenneGenreParPersonne(userId,moy_genre)
{
  this.userId= userId;
  this.moy_genre=moy_genre;
}
function MoyenneGenre(Genres, Somme, Nombre) {
  this.Genres = Genres;
  this.Somme = Somme;
  this.Nombre = Nombre;
}
let moviesRatingsPromise = new Promise((resolve) =>
  fs.createReadStream('./RecommanderSystem/data/ratings.csv')
  .pipe(csv({ headers: true }))
  .on('data', fromRatingsFile)
  .on('end', () => resolve(note))
);
let moviesDataPromise = new Promise((resolve) =>
  fs.createReadStream('./RecommanderSystem/data/movies.csv')
  .pipe(csv({ headers: true }))
  .on('data', fromMoviesFile)
  .on('end', () => resolve(movies_data))
);


function fromMoviesFile(row) {
  movies_data.push({ 
    movieId:row.movieId,
    title: row.title,
    genres: row.genres.split('|')
  });
}

function fromRatingsFile(row) {
  note.push({
    userId :row.userId,
    movieId: row.movieId,
    rating: row.rating,
    timestamp: row.timestamp,
  });
}

var ChargementDesDonnées =function(){
  return new Promise(function(resolve,reject){
    //console.log(moviesDataPromise)
    moviesDataPromise
    moviesRatingsPromise
    .then(function(){Comparaison(movies_data,note)})
    .then(function(){moyenne(MIX)})
    .then(function(){resolve(moy_genre_pers);
    });
  })
}


function moyenne(MIX)
{
  return new Promise(function(resolve,reject){
    var user=0;  
    for (var i=0;i<MIX.length;i++){
     
      for(var j=0;j<MIX[i].genres.length;j++){           
        var trouve=false;    
        if(moy_genre.length>0){
          for(var k=0;k<moy_genre.length;k++){
            if(moy_genre[k].Genres==MIX[i].genres[j]){
              trouve=true;           
            }  
          } 
        }       
        if(!trouve)  {
          var NewRating=MIX[i].rating.replace('.',',');
          moy_genre.push(new MoyenneGenre(MIX[i].genres[j],parseFloat(NewRating),1));
          
        }    
        if(trouve){
          //console.log(MIX[i].genres[j])
          const resultat =moy_genre.find(ExistGenre => ExistGenre.Genres === MIX[i].genres[j])
          var NewRating=MIX[i].rating.replace('.',',');
          resultat.Somme+=parseFloat(NewRating);
          resultat.Nombre++;
        }                 
      }
      if(moy_genre_pers.length>0){  
      
        
        if(MIX[i].userId==moy_genre_pers[user].userId){
          moy_genre_pers.moy_genre=moy_genre;
        }
        else{
          user++;
          
          moy_genre=[];
          for(var l=0;l<MIX[i].genres.length;l++){            
            moy_genre.push(new MoyenneGenre(MIX[i].genres[l],parseFloat(NewRating),1));
          }
          moy_genre_pers.push(new MoyenneGenreParPersonne(MIX[i].userId,moy_genre));
        }  
      }
      else{
        //console.log(MIX[i].userId)
        moy_genre_pers.push(new MoyenneGenreParPersonne(MIX[i].userId,moy_genre));
      }
    }
    resolve(moy_genre_pers);
  })
}
function Comparaison(Movies,Rating)
{
  
  return new Promise(function(resolve,reject){
    
    for(var i=0;i<Rating.length;i++)
    {
      for (var j=0;j<Movies.length;j++)
      {
        
        if(Rating[i].movieId==Movies[j].movieId)
        {
         
          MIX.push({
            userId:Rating[i].userId,
            movieId:Rating[i].movieId,
            rating:Rating[i].rating,
            timestamp:Rating[i].timestamp,
            title:Movies[j].title,
            genres:Movies[j].genres
          })
        }
      }
    }
    if (j==Movies.length)
    {
      resolve(MIX);
    }
  })
}


module.exports=
{ 
  Data:ChargementDesDonnées,
  Movie:movies_data,
  rate:note
 
}
