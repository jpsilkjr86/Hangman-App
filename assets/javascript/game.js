	// ********************************************* PSEUDO-CODE *********************************************

	// 1) HTML page displays game screen with CSS styles

	// 2) Dipslay "Press any key to start" - Game waits until any key is pressed before starting

	// 3) User Presses Key, Game Function Starts

	//    i) Generate random answer word (from libray or list)

	//    ii) Display a game board with a series of blanks equal to the number of characters in the answer word

	//    iii) User presses key to guess a letter

	//       a) if the letter has already been guessed, try again

	//       b) If not, proceed to (iv)

	//    iv) Compare guess letter to each letter of the answer word

	//       a) if right, change game board to include all letters matching the guessed letter

	//       b) if wrong, take one attempt remaining away

	//       c) repeat until either attempt remainings are exhausted or word is complete

	//    v) If word is complete, display victory, add a win; if not, display loss, add a loss.

	//    vi) Start over from (2)


// ******************************* DECLARE GLOBAL VARIABLES, OBJECTS, FUNCTIONS *******************************

	// A) DECLARE GLOBAL PRIMITIVE VARIABLES
	
	// Gifs decalred as string variables, which will be set as values for instances of the wordObject object type
	// in the wordLibrary array (see below).
	var starTrekGIF = '<img src="assets/gifs/starTrekGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var diddyKongGIF = '<img src="assets/gifs/diddyKongGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var wonderYrsGIF = '<img src="assets/gifs/wonderYrsGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var horseHeadGIF = '<img src="assets/gifs/horseHeadGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var thumbUpGiF = '<img src="assets/gifs/thumbUpGiF.gif" width="100%" style="border: 3px solid black;"/>';
	var damnGoodGIF = '<img src="assets/gifs/damnGoodGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var obamaGIF = '<img src="assets/gifs/obamaGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var jaimeGIF = '<img src="assets/gifs/jaimeGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var bernieGIF = '<img src="assets/gifs/bernieGIF.gif" width="100%" style="border: 3px solid black;"/>';

	
	// B) DECLARE OBJECT CONSTRUCTOR FUNCTION, TO BE USED FOR EACH ELEMENT OF WORD LIBRARY ARRAY

	// Function constructer for "wordObject" object type, which has three properties: 1) .word, the game word;
	// 2) .cssClass, the css class name, whose styles can be found on style.css and which serves as a hint for the user; 
	// and 3) .winGif, the victory GIF's, which cheer on the user when a word is guessed correctly.
	function wordObject(wrd, css, gif)
	{
		this.word = wrd;
		this.cssClass = css;
		this.winGif = gif;
	}

	// C) DECLARE VALUES OF EACH WORD LIBRARY ELEMENT, EACH OF OBJECT TYPE "wordObject"

	// wordLibrary is a global array of objects, each of which are instances of the wordObject object type. These
	// are where the words of the Hangman game are defined, as .word properties of each element of the wordLibrary array,
	// in addition to the styles (.cssClass) and GIF's (.winGif) associated with each word. See genAnsWordObj(), 
	// prodWordTheme() & playWinGif() functions for more details about how these objects' properties are interpreted.
	var wordLibrary = [""];

	wordLibrary[0] = new wordObject("calligraphy", "calligraphyTheme", obamaGIF);
	wordLibrary[1] = new wordObject("hippie", "hippieTheme", bernieGIF);
	wordLibrary[2] = new wordObject("continent", "continentTheme", diddyKongGIF);
	wordLibrary[3] = new wordObject("biology", "biologyTheme", horseHeadGIF);
	wordLibrary[4] = new wordObject("javascript", "javascriptTheme", starTrekGIF);
	wordLibrary[5] = new wordObject("cuisine", "cuisineTheme", wonderYrsGIF);
	wordLibrary[6] = new wordObject("pomegranate", "pomegranateTheme", damnGoodGIF);
	wordLibrary[7] = new wordObject("tropical", "tropicalTheme", thumbUpGiF);
	wordLibrary[8] = new wordObject("technology", "technologyTheme", jaimeGIF);


	// D) DECLARE GAMESTATUS GLOBAL OBJECT, ITS PROPERTIES AND INITIAL VALUES

	// gameStatus global object houses the number of wins and losses as well as the gameOver bool. Setting them  
	// as global variables allows them to be added to or changed by the two main functions startScreen() and  
	// gameFunction(), no matter how many times the user decides to play the game.
	var gameStatus = 
	{
		wins: 0,
		losses: 0,
		gameOver: true,
		
		// This function can print messages with or without the third optional argument!
		printMessage: function(elementId, msg, opArg)
		{
			// used " == null" so that the condition is true for either null or undefined arguments
			if (opArg == null)
			{document.getElementById(elementId).innerHTML = msg;}
			else
			{document.getElementById(elementId).innerHTML = msg + opArg;}
		},

		// This function clears HTML messages according to an elementId provided in the argument
		clearMessage: function(elementId)
		{ document.getElementById(elementId).innerHTML = ""; },

		// Prints scoreboard
		printWinsLosses: function()
		{
			document.getElementById("scoreBoardText").innerHTML = "Wins: " + this.wins + 
			"&nbsp;&nbsp;&nbsp;Losses: " + this.losses;
		},

		// This function prints set messages related to losing the game.
		printYouLose: function()
		{
			document.getElementById("gameResultText").innerHTML = "Sorry! You lose.";
			document.getElementById("gameMsgText").innerHTML = "Press any key to play again.";
			this.printWinsLosses();  // Prints the updated scoreboard.
		},

		// This function prints set messages related to winning the game.
		printYouWin: function()
		{
			document.getElementById("gameResultText").innerHTML = "Good job! You win!";
		   	document.getElementById("gameMsgText").innerHTML = "Press any key to play again.";
		   	this.printWinsLosses();  // Prints the updated scoreboard.
		}
	}; // end of gameStatus global object declaration


	// E) DECLARE GLOBAL FUNCTIONS

	// Generates and returns random word from wordLibrary, a global array of objects set above. This function 
	// also changes the background according to the object properties of the randomly generated word.
	function genAnsWordObj()
	{
		// random word object from wordLibrary is generated. The actual word is stored in the .word property of 
		// wordLibrary[x] object.
		var x = Math.floor(Math.random() * wordLibrary.length);
		var randWordObj = wordLibrary[x];

		// Shift each member of wordLibrary array left to replace the random element it just pulled
		for (i=x; i<wordLibrary.length; i++)
		{ wordLibrary[i] = wordLibrary[i+1]; }

		// Pop off the last element of the array, which became "undefined" after the for loop. This will 
		// decrease the length of the wordLibrary array by 1.
		wordLibrary.pop();

		// Return random word object.
		return randWordObj;		
	}

	// This sets the CSS class for the body and the jumbotron according to the .cssClass for a given wordObject
	function prodWordTheme(cssClassName)
	{
		// Changes style of the body and jumbotron according to the given wordObject element of the wordLibrary 
		// array. The value of the .cssClass property is the name of the CSS class, which includes a variety of 
		// unique styles for each word, including font-family, background image, jumbotron background color, 
		// text shadows, etc. See the CSS style sheet style.css for more details.
		document.body.className = cssClassName;
		document.getElementById("mainJumbotron").className = ("jumbotron text-center " + cssClassName);
		return;
	}

	// Plays animation for victory GIF's.
	function playWinGif(gif)
	{
		// Declare two containers which will contain duplicates of the same gif, positions set as absolute below.
		var cont1 = document.getElementById("gifDiv1");
		var cont2 = document.getElementById("gifDiv2");
		cont1.innerHTML = gif;
		cont2.innerHTML = gif;

		// cont1 comes from top left			// cont2 comes from top right
		cont1.style.position = "absolute"; 		cont2.style.position = "absolute";
		cont1.style.width = "18%";				cont2.style.width = "18%";
		cont1.style.left = "-20%";				cont2.style.right = "-20%";
		cont1.style.top = "-20%";				cont2.style.top = "-20%";
		cont1.style.opacity = ".70";			cont2.style.opacity = ".70";
		cont1.style.zIndex = "1000";			cont2.style.zIndex = "1000";

		// Function to move gifs diagonally. pos1 and pos2 correspond to cont1 and cont2 respectively.
		var pos1 = -20;
		var pos2 = -20;
		var id = setInterval(frame, 20);
		function frame() 
		{
			if (pos1 >= 12 || pos2 >= 12)  // Makes sure they stop at the same time
			{ clearInterval(id); } // Stops the setInterval function from moving the containers
			else 
			{
			  //sets motion of cont1, from top-left moving down-right
			  pos1 += .33;  
			  cont1.style.left = pos1 + '%';
			  cont1.style.top = pos1 + '%';

			  //sets motion of cont2, from top-right moving down-left
			  pos2 += .33;
			  cont2.style.right = pos2 + '%';
			  cont2.style.top = pos2 + '%'; 
			}
		}
	}

	// Takes any string argument and returns an array. This will prevent any conflict some browsers might 
	// have when comparing strings to arrays, as this program will do later when comparing the game board array
	// to the correct answer array.
	function wordToArray (wrd)
	{
		var ary = [""];

		for (i=0; i<wrd.length; i++)
		{ ary[i] = wrd.charAt(i); }
		return (ary);
	}

	// This function takes a string argument "play" or "stop" and plays or stops the cheers audio accordingly.
	function cheersAudio(str)
	{
		var aud = document.getElementById("cheers");
		
		if (str === "play")
		{aud.play();}

		// This not only pauses the sound bite but also resets the time so it won't resume on a later function call.
		if (str === "stop") 
		{
			aud.pause();
			aud.currentTime = 0;
		}		
	}

// **************************** MAIN GAME FUNCTIONS: startScreen() and gameFunction() ****************************

	// Essentially this whole program passes the ball back and forth between startScreen() and gameFunction(), 
	// which house the only two document.onkeyup events. This allows the program to reinitialize the onkeyup 
	// events after they automatically disable themselves. I ran into an error earlier, where the first
	// onkeyup became disabled and I was unable to call it again to restart the game. After I housed both
	// events in the two functions and had each function call each other before ending their scripts,
	// the game was able to work properly.


	// A) INITIALIZE / RESTART GAME: startScreen()

	// startScreen() function is called "onload" in the HTML body (see <body> tag in HTML file)
	// and if user chooses to play again.

	function startScreen()
	{
		document.onkeyup = function(event)  // event triggered if any key is pressed when this function is active
		{
			// If all the elements of wordLibrary have been used up
			if (wordLibrary.length === 0)
			{
				// Clears gifs, , stops sounds, prints closing message and disables game.
				gameStatus.clearMessage("gifDiv1");
				gameStatus.clearMessage("gifDiv2");
				cheersAudio("stop"); // argument "stop" tells the function to stop any sound that's playing.
				gameStatus.printMessage("gameMsgText", "Congratulations! You have used up all the words in this game.");
				document.onkeyup = null;
				return;
			}
			else if (gameStatus.gameOver)
			{
			   	// Cleans up the board when this function is called for restarting the game.
			   	gameStatus.clearMessage("gameResultText"); 
			   	gameStatus.clearMessage("attemptsRemainingText"); 
			   	gameStatus.clearMessage("lettersGuessedText");
			   	gameStatus.clearMessage("gifDiv1");
			   	gameStatus.clearMessage("gifDiv2");
			   	cheersAudio("stop"); // argument "stop" tells the function to stop any sound that's playing.

			   	// Prints message, calls gameFunction(), ends script.
			   	gameStatus.printMessage("gameMsgText", "Now press any letter key to guess a letter!");
			   	gameFunction();
			   	return;
			}								
		} // end of onkeyup event function
	}  // end of startScreen() function


	// B) MAIN GAME FUNCTION: gameFunction()

	// The purpose of this function is to carry out and order all game tasks. It is called in startScreen()  
	// when user presses a key (see above). 

	function gameFunction ()
	{
		// set global boolean gameStatus.gameOver equal to false at the beginning of each game.
	   	gameStatus.gameOver = false;

		// Declare local object variable "hangMan" scoped to gameFunction, set its properties' initial values
		// as below every time the game is started.
		var hangMan = 
		{
			letterGuessed: "",  // user input variable for guessed letters.
			lettersGuessedAry: [""],  // running list of all guessed letters, right and wrong.
			numOfGuesses: 0,  // number of guesses, to be used as the index for lettersGuessedAry[] when adding new letters.
			gameBoardAry: [""],  // running list of correctly guessed letters, i.e. the user's Hangman Game Board.
			attemptsRemaining: 10, // i.e. the initial number of "lives" the user has.
			answerWordAry: [""],
			
			// Takes a word and returns an array full of blanks.
			genBlankBoard: function()
			{
				for (g = 0; g < this.answerWordAry.length; g++)
				{ this.gameBoardAry[g] = " _ "; }	
				return;
			},

			// Converts an array argument into a string, adds an extra space in between each element, prints result.
			printGameBoard: function()
			{
				// .join is a function i looked up that converts an array of characters into a string.
				var stringX = this.gameBoardAry.join(" ");
				document.getElementById("gameBoardText").innerHTML = stringX;
			},
			
			// Simple loop check to see if a letter argument matches any element of an array argument.
			wasLetterAlreadyGuessed: function()
			{
				for (i = 0; i < this.lettersGuessedAry.length; i++)
				{
					if (this.lettersGuessedAry[i] === this.letterGuessed)
					{ return true; }
				}
				// if function exits the loop then it must be false
				return false;
			},

			// Add letterGuessed to the list of guessed letters in lettersGuessedAry
			addLtrToGuessAry: function()
			{
				// Did not use ".push()" because of an issue where it would push the first added letter to 
				// index 1 rather than index 0, since the array was declared as an empty string. Not sure how 
				// to fix that.				
				this.lettersGuessedAry[this.numOfGuesses] = this.letterGuessed;
				this.numOfGuesses++;
			},

			// Checks to see if the letter is correct by comparing it to the answerWordAry
			isLetterCorrect: function()
			{
				for (j = 0; j < this.answerWordAry.length; j++)
				{
					if (this.answerWordAry[j] === this.letterGuessed)
					{ return true; }
				}
				// if function exits the loop then it must be false
				return false;
			},

			// This function updates the game board by checking which position letterGuessed matches  
			// the correct answer word, and then replacing the blank space in the same position on the 
			// game board with the same letter. The for loop doesn't break, which allows multiple 
			// elements to be replaced by the same letter.
			updateGameBoard: function()
			{
				for (k = 0; k < this.answerWordAry.length; k++)
				{
					if (this.answerWordAry[k] === this.letterGuessed)
					{ this.gameBoardAry[k] = this.letterGuessed; }
				}
				return;
			},

			// This runs a quick loop checking to see if the game board and answer word arrays exactly match or not.
			// If there's one inconcistency it returns false. If it can exit the loop then it must be true, so it
			// returns true.
			areAllLettersOk: function()
			{
				for (m = 0; m < this.answerWordAry.length; m++)
				{
					if (this.gameBoardAry[m] !== this.answerWordAry[m])
					{ return false; }
				}
				// if the function can exit the for loop, then it must be true that All Letters are Ok
				return true;
			}

		};  //end of hangMan object declaration

		// Generate one random answer word object, which contains the answer word and corresponding styles, 
		// themes, and gifs. This local object variable is equal to a random element from the wordLibrary  
		// array. See global wordObj and wordLibrary[] declarations above as well as genAnsWordObj for more details.
		var answerWordObj = genAnsWordObj(); // returns object with properties: .word, .cssStyle, .winGif
		
		// Produces the web page styles that are associated with the randomly generated word object's 
		// .cssClass property value, serving as a hint for the user.
		prodWordTheme(answerWordObj.cssClass);

		// Converts answer word into an array and stores it in hangMan object so that it can be compared later 
		// with hangMan.gameBoardAry.
		hangMan.answerWordAry = wordToArray(answerWordObj.word);

		// Generate blank game board array, print it along with attempts remaining and wins/losses.
		hangMan.genBlankBoard();  
		hangMan.printGameBoard();
		gameStatus.printMessage("attemptsRemainingText", "Attempts Remaining: ", hangMan.attemptsRemaining);
		gameStatus.printWinsLosses();

		// Main game procresses, triggered by input between keycodes 65 (a/A) and 90 (z/Z)
		document.onkeyup = function(event)
		{
			if (event.keyCode >= 65 && event.keyCode <= 90)
		   	{
		   		// Always converts the guessed letter to lowercase, stores it and displays it for the user
		   		hangMan.letterGuessed = event.key.toLowerCase();
		   		gameStatus.printMessage("gameMsgText", "You guessed: ", hangMan.letterGuessed);

		   		// Condition is a function which checks to see if letter was already guessed (returns bool)
				if (hangMan.wasLetterAlreadyGuessed())
				{ gameStatus.printMessage("gameResultText", "Letter was already guessed."); }

				else // I.e. if letter was not already guessed
				{
					// Adds letter to running list of guessed letters, then displays it.
					hangMan.addLtrToGuessAry();
					gameStatus.printMessage("lettersGuessedText", "List of Guessed Letters: ", hangMan.lettersGuessedAry);
					
					// Condition is a function which checks to see if letter was correct (returns bool)
					if (hangMan.isLetterCorrect())
					{
						// Update and print the game board
						hangMan.updateGameBoard();
						hangMan.printGameBoard();

						// Condition is a function which checks to see if all board letters are complete (returns bool)
						if (hangMan.areAllLettersOk())
					   	{
					   		gameStatus.wins++;
					   		gameStatus.gameOver = true;						   		
					   		gameStatus.printYouWin();
					   		playWinGif(answerWordObj.winGif);
					   		cheersAudio("play"); // argument "play" tells the function to play.
					   		startScreen(); // passes ball back to startScreen() function
					   		return;
					   	}
					   	else { gameStatus.printMessage("gameResultText", "Match! See game board."); }
					}
					else  // I.e. if letter is not correct
					{							
						hangMan.attemptsRemaining--;
						gameStatus.printMessage("attemptsRemainingText", "Attempts Remaining: ", hangMan.attemptsRemaining);
						if (hangMan.attemptsRemaining === 0)
					    {
					   		gameStatus.losses++;
					   		gameStatus.gameOver = true;
					   		gameStatus.printYouLose();
					   		startScreen(); // passes ball back to startScreen() function
					   		return;
					    }
						else  // I.e. if the letter is not correct but there are still remaining attempts
						{ gameStatus.printMessage("gameResultText", "Incorrect guess. Try again!"); }				
					}
				} // end of else (letter not alredy guessed)				
			} //end of keycode input conditional 
		} //end of document.onkeyup
	} //end of gameFunction(). Program will stay here until the ball is passed back to startScreen(). (see
	 //win & loss conditions with "return" above)