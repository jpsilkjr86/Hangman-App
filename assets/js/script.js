
  
	// ******PSEUDO-CODE******

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


	// ******DECLARE GLOBAL VARIABLES*******
	
	// gameOver is passed back and forth between the two main functions startScreen() and gameFunction()
	// initial value set to true
	var gameOver = true;

	// numOfWins and numOfLosses set to 0. They're global so that they can be changed on multiple function calls of startScreen() and gameFunction()
	var numOfWins = 0;
	var numOfLosses = 0;

	// Declare music variable names, which will be used below in the wordObject instances.
	// var wildWestMusic = '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/59154337&amp;color=ff5500&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>';

	// ******DECLARE GLOBAL OBJECTS AND OBJECT CONSTRUCTOR FUNCTION******
	// Function constructer for "wordObject" object type, which enables stylistic changes for each new word serving as a "hint" to the user
	function wordObject(wrd, css)
	{
		this.word = wrd;
		this.cssClass = css;
		// this.music = msc;
	}

	// wordLibrary is a global array of objects, each of which are instances of the wordObject object type. These are where the words of the Hangman game are defined, as .word properties of each element of wordLibrary array, in addition to the styles for each word to be guessed. See genAnsWordObj() function for more details about how this object is interpreted.
	var wordLibrary = [""];

	wordLibrary[0] = new wordObject("library", "libraryTheme");
	wordLibrary[1] = new wordObject("hippie", "hippieTheme");
	wordLibrary[2] = new wordObject("continent", "continentTheme");
	wordLibrary[3] = new wordObject("biology", "biologyTheme");
	wordLibrary[4] = new wordObject("javascript", "javascriptTheme");
	wordLibrary[5] = new wordObject("cuisine", "cuisineTheme");
	wordLibrary[6] = new wordObject("pomegranate", "pomegranateTheme");
	wordLibrary[7] = new wordObject("tropical", "tropicalTheme");
	wordLibrary[8] = new wordObject("technology", "technologyTheme");

	
	// ******INITIALIZE GAME****** -- startScreen() function is called "onload" in HTML body and if user chooses to play again.
	
	function startScreen()
	{
		document.onkeyup = function(event)
		{
			if (wordLibrary.length === 0)
			{
				// Prints message and disables game.
				clearMessage("gameMsgText");
				printMessage("gameResultText", "Congratulations! You have used up all the words in this game.");
				document.onkeyup = null;
				return;
			}
			else
			{
				if (gameOver)
				{
				   	// Clears the board when this function is called for restarting the game.
				   	clearMessage("gameResultText"); 
				   	clearMessage("attemptsRemainingText"); 
				   	clearMessage("lettersGuessedText");

				   	// Prints message, calls gameFunction(), ends script.
				   	printMessage("gameMsgText", "Now press any letter key to guess a letter!");
				   	gameFunction();
				   	return;
				}
			}					
		}
	}

	


	// ******MAIN GAME FUNCTION******* -- to carry out and order all game tasks, called when user presses a key (see above). Essentially this whole program passes the ball back and forth between startScreen() and gameFunction(), which house the only two document.onkeyup events. This allows the program to reinitialize the onkeyup events after they automatically disable themselves. I ran into an error earlier, where the first onkeyup became disabled and I was unable to call it again to restart the game. After I housed both events in the two functions and had each function call each other before ending their scripts, the game was able to work properly.

	function gameFunction ()
	{
		// set gameOver to false at the beginning of each game.
	   	gameOver = false;

		// Declare local variables scoped to gameFunction, set their initial values.
		var attemptsRemaining = 10;
		var letterGuessed = "";	 // user input variable for guessed letters			
		var gameBoardArray = [""];  // Running list of correct letters, i.e. the user's Hangman Game Board
		var numOfGuessedLetters = 0;   // to be used as the index for lettersGuessedArray[] when adding new letters
		var lettersGuessedArray = [""];  // running list of all guessed letters, right and wrong.

		// Generate one random answer word object, which contains the answer word and corresponding styles and themes.
		var answerWordObj = genAnsWordObj();

		// Converts the answer word into an array so that it can be compared later with the gameBoardArray.
		answerWordObj.word = wordToArray(answerWordObj.word);

		// Produces the web page styles that are associated with the answer word, serving as a hint for the user.
		prodWordTheme(answerWordObj);

		// Generate blank game board, same length as answerWordObj.word but letters replaced by spaces.
		gameBoardArray = genBlankBoard(answerWordObj.word);

		// Print game board, which at this point will be all blank
		printGameBoard(gameBoardArray);

		// Main game procresses, triggered by input between keycodes 65 (a/A) and 90 (z/Z)
		document.onkeyup = function(event)
		{
			if (event.keyCode >= 65 && event.keyCode <= 90)
		   	{
		   		// Always converts the guessed letter to lowercase, stores it and displays it for the user
		   		letterGuessed = event.key.toLowerCase();
		   		printMessage("gameMsgText", "You guessed: ", letterGuessed);

		   		// Condition is a function which checks to see if letter was already guessed (returns bool)
				if (wasLetterAlreadyGuessed(letterGuessed, lettersGuessedArray))
				{ printMessage("gameResultText", "Letter was already guessed."); }

				else // I.e. if letter was not already guessed
				{
					// Add letterGuessed to the list of guessed letters in lettersGuessedArray.
					// Did not use ".push()" because of an issue where it would push the first added letter to index 1 rather than index 0, since the array was declared as an empty string. Not sure how to fix that.				
					lettersGuessedArray[numOfGuessedLetters] = letterGuessed;
					numOfGuessedLetters++;
					printMessage("lettersGuessedText", "List of Guessed Letters: ", lettersGuessedArray);
					
					// Condition is a function which checks to see if letter was correct (returns bool)
					if (isLetterCorrect(letterGuessed, answerWordObj.word))
					{
						// Update and print the game board
						gameBoardArray = updateGameBoard(letterGuessed, answerWordObj.word, gameBoardArray);
						printGameBoard(gameBoardArray);

						// Condition is a function which checks to see if all board letters are complete (returns bool)
						if (areAllLettersOk(answerWordObj.word, gameBoardArray))
					   	{
					   		numOfWins++;
					   		gameOver = true;
							clearMessage("attemptsRemainingText");						   		
					   		printYouWin();	
					   		startScreen(); // passes ball back to startScreen() function
					   		return;
					   	}
					   	else { printMessage("gameResultText", "Match! See game board."); }
					}
					else  // I.e. if letter is not correct
					{							
						attemptsRemaining--;
						printMessage("attemptsRemainingText", "Attempts Remaining: ", attemptsRemaining);
						if (attemptsRemaining === 0)
					    {
					   		numOfLosses++;
					   		gameOver = true;
					   		printYouLose();
					   		startScreen(); // passes ball back to startScreen() function
					   		return;
					    }
						else  // I.e. if the letter is not correct but there are still remaining attempts
						{ printMessage("gameResultText", "Incorrect guess. Try again!"); }				
					}
				} // end of else (letter not alredy guessed)				
			} //end of keycode input conditional 
		} //end of document.onkeyup
	} //end of gameFunction(). Program will stay here until the ball is passed back to startScreen() (see win / loss conditions with "return" above)


	// ******DECLARE SUBORDINATE FUNCTIONS*******

	// This function can print messages with or without the third optional argument!
	function printMessage(elementId, msg, opArg)
	{
		// used " == null" so that the condition is true for either null or undefined arguments
		if (opArg == null)
		{document.getElementById(elementId).innerHTML = msg;}
		else
		{document.getElementById(elementId).innerHTML = msg + opArg;}
	}

	// This function clears HTML messages according to an elementId provided in the argument
	function clearMessage(elementId)
	{ document.getElementById(elementId).innerHTML = ""; }

	
	// Generates and returns random word from wordLibrary, a global array of objects set above. This function also changes the background according to the object properties of the randomly generated word.
	function genAnsWordObj()
	{
		// random word object from wordLibrary is generated. The actual word is stored in the .word property of wordLibrary[x] object.
		var x = Math.floor(Math.random() * wordLibrary.length);
		var randWordObj = wordLibrary[x];

		// Shift each member of wordLibrary array left to replace the random element it just pulled
		for (i=x; i<wordLibrary.length; i++)
		{ wordLibrary[i] = wordLibrary[i+1]; }

		// Pop off the last element of the array, which became "undefined" after the for loop. This will decrease the length of the wordLibrary array by 1.
		wordLibrary.pop();

		// Return random word object.
		return randWordObj;		
	}

	function prodWordTheme(obj)
	{
		// Changes style of the body according to answerWordObject.cssClass
		document.body.className = obj.cssClass;
		document.getElementById("mainJumbotron").className = ("jumbotron text-center " + obj.cssClass);
		return;
	}

	// Takes any string argument and returns an array. This will prevent any conflict some browsers might have when comparing strings to arrays, as this program will do later when comparing the game board to the correct answer.
	function wordToArray (wrd)
	{
		var ary = [""];

		for (i=0; i<wrd.length; i++)
		{ ary[i] = wrd.charAt(i); }
		return (ary);
	}

	// Takes a word and returns an array full of blanks.
	function genBlankBoard(gmWrd)
	{
		var arrayX = [""];

		for (g=0; g<gmWrd.length; g++)
		{ arrayX[g] = " _ "; }
		
		return arrayX;
	}

	// Converts an array argument into a string, adds an extra space in between each element, prints result.
	function printGameBoard(gmBrd)
	{
		// .join is a function i looked up that converts an array of characters into a string.
		var stringX = gmBrd.join(" ");
		document.getElementById("gameBoardText").innerHTML = stringX;
	}

	// Simple loop check to see if a letter argument matches any element of an array argument.
	function wasLetterAlreadyGuessed(ltr, ary)
	{
		for (i=0; i<ary.length; i++)
		{
			if (ary[i] === ltr)
			{ return true; }
		}
		// if function exits the loop then it must be false
		return false;
	}

	// This function performs the same exact task as wasLetterAlreadyGuessed() above, but is named differently for the sake of descriptiveness.
	function isLetterCorrect(ltr, gmWrd)
	{
		for (j=0; j<gmWrd.length; j++)
		{
			if (gmWrd[j] === ltr)
			{ return true; }
		}
		// if function exits the loop then it must be false
		return false;
	}

	// This function updates the game board by checking which position the guessed letter (ltr) matches the correct answer word (gmWrd), and then replacing the blank space in the same position on the game board (gmBrd) with the same letter (ltr). The for loop doesn't break, which allows multiple elements to be replaced by the same letter.
	function updateGameBoard(ltr, gmWrd, gmBrd)
	{
		for (k=0; k<gmWrd.length; k++)
		{
			if (gmWrd[k] === ltr)
			{ gmBrd[k] = ltr; }
		}
		// always return gmBrd at the end
		return gmBrd;
	}

	// This runs a quick loop checking to see if gmBrd and gmWrd arrays exactly match or not. If there's one inconcistency it returns false. If it can exit the loop then it must be true, so returns true.
	function areAllLettersOk(gmWrd, gmBrd)
	{
		for (m=0; m<gmWrd.length; m++)
		{
			if (gmBrd[m] !== gmWrd[m])
			{ return false; }
		}
		// if the function can exit the for loop, then it must be true that All Letters are Ok
		return true;
	}

	// This function prints set messages related to losing the game. numOfWins and numOfLosses are global variables.
	function printYouLose()
	{
		document.getElementById("gameResultText").innerHTML = "Sorry! You lose.";
		document.getElementById("gameMsgText").innerHTML = "Press any key to play again.";
		document.getElementById("scoreBoardText").innerHTML = "Wins: " + numOfWins + "<br>Losses: " + numOfLosses;
	}

	// This function prints set messages related to winning the game. numOfWins and numOfLosses are global variables.
	function printYouWin()
	{
		document.getElementById("gameResultText").innerHTML = "Good job! You win!";
	   	document.getElementById("gameMsgText").innerHTML = "Press any key to play again.";
	   	document.getElementById("scoreBoardText").innerHTML = "Wins: " + numOfWins + "<br>Losses: " + numOfLosses;
	}