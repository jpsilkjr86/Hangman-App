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

	// numOfWins and numOfLosses set to 0. They're global so that they can be changed on  
	// multiple function calls of startScreen() and gameFunction()
	var numOfWins = 0;
	var numOfLosses = 0;
	
	// Gifs decalred as string variables, which will be set as values for instances of the wordObject object type
	// in the wordLibrary array.
	var starTrekGIF = '<img src="assets/gifs/starTrekGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var diddyKongGIF = '<img src="assets/gifs/diddyKongGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var wonderYrsGIF = '<img src="assets/gifs/wonderYrsGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var horseHeadGIF = '<img src="assets/gifs/horseHeadGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var thumbUpGiF = '<img src="assets/gifs/thumbUpGiF.gif" width="100%" style="border: 3px solid black;"/>';
	var damnGoodGIF = '<img src="assets/gifs/damnGoodGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var obamaGIF = '<img src="assets/gifs/obamaGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var jaimeGIF = '<img src="assets/gifs/jaimeGIF.gif" width="100%" style="border: 3px solid black;"/>';
	var bernieGIF = '<img src="assets/gifs/bernieGIF.gif" width="100%" style="border: 3px solid black;"/>';


	// ******DECLARE GLOBAL OBJECTS AND OBJECT CONSTRUCTOR FUNCTION******
	// Function constructer for "wordObject" object type, which has three properties: 1) the game word;
	// 2) the css class name, whose styles can be found on style.css and which serves as a hint for the user; 
	// and 3) the victory GIF's, which cheer on the user when a word is guessed correctly.
	function wordObject(wrd, css, gif)
	{
		this.word = wrd;
		this.cssClass = css;
		this.winGif = gif;
	}

	// wordLibrary is a global array of objects, each of which are instances of the wordObject object type. 
	// These are where the words of the Hangman game are defined, as .word properties of each element of the
	// wordLibrary array, in addition to the styles for each word to be guessed. See genAnsWordObj(), prodWordTheme()
	// and playWinGif functions for more details about how this object's properties are interpreted.
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

	
	// ******INITIALIZE OR RESTART GAME****** -- startScreen() function is called "onload" in the 
	// HTML body (see <body> tag in HTML file) and if user chooses to play again.

	function startScreen()
	{
		document.onkeyup = function(event)
		{
			// If all the elements of wordLibrary have been used up
			if (wordLibrary.length === 0)
			{
				// Clears gifs, prints closing message and disables game.
				clearMessage("gifDiv1");
				clearMessage("gifDiv2");
				printMessage("gameMsgText", "Congratulations! You have used up all the words in this game.");
				document.onkeyup = null;
				return;
			}
			else
			{
				if (gameOver)
				{
				   	// Cleans up the board when this function is called for restarting the game.
				   	clearMessage("gameResultText"); 
				   	clearMessage("attemptsRemainingText"); 
				   	clearMessage("lettersGuessedText");
				   	clearMessage("gifDiv1");
				   	clearMessage("gifDiv2");

				   	// Prints message, calls gameFunction(), ends script.
				   	printMessage("gameMsgText", "Now press any letter key to guess a letter!");
				   	gameFunction();
				   	return;
				}
			}					
		}
	}


	// ******MAIN GAME FUNCTION******* -- to carry out and order all game tasks, called when user 
	// presses a key (see above). Essentially this whole program passes the ball back and forth 
	// between startScreen() and gameFunction(), which house the only two document.onkeyup events. This 
	// allows the program to reinitialize the onkeyup events after they automatically disable themselves. 
	// I ran into an error earlier, where the first onkeyup became disabled and I was unable to call it 
	// again to restart the game. After I housed both events in the two functions and had each function 
	// call each other before ending their scripts, the game was able to work properly.

	function gameFunction ()
	{
		// set global variable gameOver to false at the beginning of each game.
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

		// Print initial game board (all blank), attempts remaining, and wins/losses
		printGameBoard(gameBoardArray);
		printMessage("attemptsRemainingText", "Attempts Remaining: ", attemptsRemaining);
		printWinsLosses();

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
					// Did not use ".push()" because of an issue where it would push the first added letter to 
					// index 1 rather than index 0, since the array was declared as an empty string. Not sure how 
					// to fix that.				
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
					   		printYouWin();
					   		playWinGif(answerWordObj.winGif);
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
	function prodWordTheme(obj)
	{
		// Changes style of the body according to the given wordObject element of the wordLibrary array.
		// The .cssClass property is the name of the CSS class, which includes a variety of unique styles for
		// each word, including font-family, background image, jumbotron background color, text shadows, etc.
		// See the CSS style sheet style.css for more details.
		document.body.className = obj.cssClass;
		document.getElementById("mainJumbotron").className = ("jumbotron text-center " + obj.cssClass);
		return;
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

	// This function performs the same exact task as wasLetterAlreadyGuessed() above, but is named differently 
	// for the sake of descriptiveness.
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

	// This function updates the game board by checking which position the guessed letter (ltr) matches  
	// the correct answer word (gmWrd), and then replacing the blank space in the same position on the 
	// game board (gmBrd) with the same letter (ltr). The for loop doesn't break, which allows multiple 
	// elements to be replaced by the same letter.
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

	// This runs a quick loop checking to see if gmBrd and gmWrd arrays exactly match or not. If there's 
	// one inconcistency it returns false. If it can exit the loop then it must be true, so returns true.
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

	// This function prints set messages related to losing the game.
	function printYouLose()
	{
		document.getElementById("gameResultText").innerHTML = "Sorry! You lose.";
		document.getElementById("gameMsgText").innerHTML = "Press any key to play again.";
		printWinsLosses();  // Prints the updated scoreboard.
	}

	// This function prints set messages related to winning the game.
	function printYouWin()
	{
		document.getElementById("gameResultText").innerHTML = "Good job! You win!";
	   	document.getElementById("gameMsgText").innerHTML = "Press any key to play again.";
	   	printWinsLosses();  // Prints the updated scoreboard.
	}

	// This simple function prints the scoreboard. numOfWins and numOfLosses are global variables.
	function printWinsLosses()
	{
		document.getElementById("scoreBoardText").innerHTML = "Wins: " + numOfWins + "&nbsp;&nbsp;&nbsp;Losses: " + numOfLosses;
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