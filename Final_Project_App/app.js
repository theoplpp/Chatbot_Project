const Readline = require('readline');
const matcher = require('./matcher/index.js');
const MyMovie = require('./RecommanderSystem/index.js')

const rl = Readline.createInterface({ // for reading inputs
	input: process.stdin,
	output: process.stdout,
	terminal: false
});
rl.setPrompt('>');
rl.prompt();
rl.on('line', reply => {
	reply = reply.replace("?", "").trim();
	matcher(reply, data => {

		switch (`${data.intent}`) {
			case 'Hello':
				console.log(`${data.entities.greeting} ! My name is MG, MG is for MovieGuide, how are you?`);
				break;
			case 'goodand':
				console.log(`Very good, thank you !`);
				console.log(`how can I help you ?`);
				console.log('You can ask me to advise you some movies')
				console.log('You can ask me informations about a movie')
				console.log('You can ask me the grades of the movie')
				break;
			case 'good':
				console.log(`Great, how can I help you ?`)
				console.log('You can ask me to advise you some movies')
				console.log('You can ask me informations about a movie')
				console.log('You can ask me the grades of the movie')
				break;

			case 'Movie':
				Movie(data);
				break;
			case 'gender':
				Gender()
				break;
			case 'grade':
				Grade()
				break;
			case 'thank':
				console.log("You are welcome, can I do something else for you ?")
				break;
			case 'Exit':
				console.log('See you !');
				process.exit(0)
			default: {
				console.log("Sorry, I don't understand your question...");
			}
		}rl.prompt();
	});

});

function Grade() {
	console.log("Give me the title of the movie you want to know the grade")
	rl.question('', function (answer) {
		MyMovie.grade(answer).then(function (result) {

			console.log("the grades are :")
			for (var i = 0; i < result.length - 1; i++) {
				console.log(result[i])
			}
			console.log("the average is : " + result[result.length - 1] + " on 5")

		})
	})
}

function Gender() {
	console.log("Give me the title of the movie you want to know about gender")
	rl.question(' ', function (answer) {
		MyMovie.gender(answer).then(function (result) {
			if (result.length == 1) {
				console.log("These are the genders of the movie : " + result[0].title)
				result[0].genres.forEach(element => console.log(element))
			}
			if (result.length > 1) {
				console.log("I founded more than one movie containing the word : " + answer)
				//console.log(result)
				result.forEach(element => {
					console.log("for the film : " + element.title + ", the genders of the movies are :")
					element.genres.forEach(genre => { console.log(genre) })

				})
			}
		})

	})
}
function Movie(data) {
	return new Promise(function (resolve, reject) {
		console.log("Are you a new user?\nyes/no>")
		rl.question(' ', function (answer) {
			if (answer == "no") {
				console.log("What is your user Id :")
				rl.question('', function (userId) {
					rl.close();
					console.log("Loading of your 3 movies, please wait...")
					MyMovie.OldUser(parseInt(userId), 3)
						.then(function (result) {
							console.log(result);
							resolve("succes")
						})
				})
			}
			else if (answer == "yes") {
				var gender = ["Thriller", "Adventure", "Animation", "Children", "Comedy", "Fantasy", "Romance", "Drama", "Action", "Crime", "Horreur", "Sci-Fi", "Mystery", "War"];
				console.log("Can you please choose a first gender ? It will allow me to get to know you better :");
				for (var i = 0; i < gender.length; i++) {
					console.log((i + 1) + " : " + gender[i]);
				}
				rl.question('first>', answer1 => {
					var Answer1 = gender[parseInt(answer1) - 1];
					console.log(`${Answer1} Can you please choose a second one ?`)
					rl.question('second>', answer2 => {
						var Answer2 = gender[parseInt(answer2) - 1];
						console.log(`You choice are ${Answer1} and ${Answer2}`)
						MyMovie.NewUser(Answer1, Answer2, 3)
							.then(function (result) {
								console.log("Loading of your 3 movies, please wait...")
								console.log(result)
							});
						resolve("success")
					})
				})

			}
			else {
				console.log("Sorry we didn't understand your answer..");
				Movie(data);
			}
		})

	})
}