/*
 This game is a very simple knock off of Monopoly.
 
 It is set up using an IIFE to create a Game object. 
 
 Then there are two types of ojbects used to create the game:
    Square objects to represent the squares on the board (all known as properties, 
	  but I'm mostly calling them Squares to avoid confusion with object properties).
	  These store value, rent, name, etc. 
	Player objects, representing the different players in the game. These store name,
	  cash, ID, etc.
 These objects are created at the beginning of the game (within the Game object)
 and are updated as the game progresses.
 
 The players roll the dice and progress around the board. They can buy property when they
 land on an open square. First player to go below $0 loses.
 
 There are some limitations on what you can do in this game based on the amount of time I have left for this project:
 1. two fixed players
 2. no selling to other player
 3. no auction
 4. no houses or hotels
 5. no mortgages
*/

window.onload = function() {
  //find dice role button and bind takeTurn method
  var rollButton = document.getElementById("rollButton");
  rollButton.onclick = Game.takeTurn;

  //initialize board
  Game.populateBoard();
};

//IIFE function to create game board object
var Game = (function() {
  //create a game object to hold the game board squares, methods, players
  var game = {};

  //build an array of game propreties (calling them squares, as in squares on the game board, so
  //I don't confuse them with object properties
  //there are 11 properties on the game board.
  //each has a unique name and value, so each will probably need to be built individually (not through a loop)
  game.squares = [
    new Square("Basset Hound Ave.", 100, "square2"),
    new Square("Great Dane Street", 150, "square3"),
    new Square("Poodle Highway", 200, "square4"),
    new Square("Bull Terrier Way", 250, "square5"),
    new Square("Retriever Road", 300, "square6"),
    new Square("German Shepard Road", 350, "square7"),
    new Square("Greyhound Gap", 400, "square8"),
    new Square("Whippet Way", 450, "square9"),
    new Square("Labrador Lane", 500, "square10"),
    new Square("Beagle Blvd.", 550, "square11"),
    new Square("Walker Hound Way", 600, "square12")
  ];

  //build an array of players
  //note: initial version of the game only allows two fixed players
  game.players = [
    new Player("Stan", 1000, "Triangle", "player1"),
    new Player("Ike", 1000, "Circle", "player2")
  ];

  //set the game property for current player. Initially player 1. (Using an index of the game.players array.)
  game.currentPlayer = 0;

  //set up a method that will add the squares to the game board
  game.populateBoard = function() {
    //loop through all the squares in the game board
    for (var i = 0; i < this.squares.length; i++) {
      //get square ID from object and then find its div
      var id = this.squares[i].squareID;

      //add info to squares
      //paragraphs for square info preexist in HTML. That way they just have to be
      //updated here and I can use the same method to create and update
      var squareName = document.getElementById(id + "-name");
      var squareValue = document.getElementById(id + "-value");
      var squareOwner = document.getElementById(id + "-owner");

      squareName.innerHTML = this.squares[i].name;
      squareValue.innerHTML = "$" + this.squares[i].value;
      squareOwner.innerHTML = this.squares[i].owner;
    }

    //find the start square and add all players
    var square1 = document.getElementById("square1-residents");
    for (var i = 0; i < game.players.length; i++) {
      //using private function to create tokens
      game.players[i].createToken(square1);
    }

    //populate the info panel (using simple private function)
    updateByID("player1-info_name", game.players[0].name);
    updateByID("player1-info_cash", game.players[0].cash);
    updateByID("player2-info_name", game.players[1].name);
    updateByID("player2-info_cash", game.players[1].cash);
  };

  //public function to handle taking of turn. Should:
  //roll the dice
  //advance the player
  //call function to either allow purchase or charge rent
  game.takeTurn = function() {
    //roll dice and advance player
    movePlayer();

    //check the tile the player landed on
    //if the tile is not owned, prompt player to buy
    //if the tile is owned, charge rent and move on
    checkTile();

    //loss condition:
    //if current player drops below $0, they've lost
    if (game.players[game.currentPlayer].cash < 0) {
      alert("Sorry " + game.players[game.currentPlayer].name + ", you lose!");
    }

    //advance to next player
    game.currentPlayer = nextPlayer(game.currentPlayer);

    //update info panel with name of current player
    updateByID("currentTurn", game.players[game.currentPlayer].name);
  };

  /****                    Game-level private functions                        *****/
  //function to advance to the next player, going back to to player 1 when necessary
  //(leaving this as a private function rather than method of Player because
  //current player is more of a game level property than a player level property)
  function nextPlayer(currentPlayer) {
    var nextPlayer = currentPlayer + 1;

    if (nextPlayer == game.players.length) {
      return 0;
    }

    return nextPlayer;
  }

  //function to "roll the dice" and advance the player to the appropriate square
  function movePlayer() {
    //"dice roll". Should be between 1 and 4
    var moves = Math.floor(Math.random() * (4 - 1) + 1);
    //need the total number of squares, adding 1 because start isn't included in the squares array
    var totalSquares = game.squares.length + 1;
    //get the current player and the square he's on
    var currentPlayer = game.players[game.currentPlayer];
    var currentSquare = parseInt(currentPlayer.currentSquare.slice(6));

    //figure out if the roll will put player past start. If so, reset and give money for passing start
    if (currentSquare + moves <= totalSquares) {
      var nextSquare = currentSquare + moves;
    } else {
      var nextSquare = currentSquare + moves - totalSquares;
      currentPlayer.updateCash(currentPlayer.cash + 100);
      console.log("$100 for passing start");
    }

    //update current square in object (the string "square" plus the index of the next square)
    currentPlayer.currentSquare = "square" + nextSquare;

    //find and remove current player token
    var currentToken = document.getElementById(currentPlayer.id);
    currentToken.parentNode.removeChild(currentToken);

    //add player to next location
    currentPlayer.createToken(
      document.getElementById(currentPlayer.currentSquare)
    );
  }

  //function that checks the tile the player landed on and allows the player to act appropriately
  //(buy, pay rent, or move on if owned)
  function checkTile() {
    var currentPlayer = game.players[game.currentPlayer];
    var currentSquareId = currentPlayer.currentSquare;
    var currentSquareObj = game.squares.filter(function(square) {
      return square.squareID == currentSquareId;
    })[0];

    //check if the player landed on start
    if (currentSquareId == "square1") {
      currentPlayer.updateCash(currentPlayer.cash + 100);
      updateByID(
        "messagePara",
        currentPlayer.name + ": You landed on start. Here's an extra $100"
      );
    } else if (currentSquareObj.owner == "For Sale") {
      //If the property is unowned, allow purchase:
      //check if owner can afford this square
      if (currentPlayer.cash <= currentSquareObj.value) {
        updateByID(
          "messagePara",
          currentPlayer.name +
            ": Sorry, you can't afford to purchase this property"
        );
        return;
      }

      //prompt to buy tile
      var purchase = window.confirm(
        currentPlayer.name +
          ": This property is unowned. Would you like to purchase this property for $" +
          currentSquareObj.value +
          "?"
      );
      //if player chooses to purchase, update properties:
      if (purchase) {
        //update ownder of current square
        currentSquareObj.owner = currentPlayer.id;
        //update cash in the player object
        currentPlayer.updateCash(currentPlayer.cash - currentSquareObj.value);
        //log a message to the game board
        updateByID(
          "messagePara",
          currentPlayer.name + ": you now have $" + currentPlayer.cash
        );
        //update the owner listed on the board
        updateByID(
          currentSquareObj.squareID + "-owner",
          "Owner: " + game.players[game.currentPlayer].name
        );
      }
    } else if (currentSquareObj.owner == currentPlayer.id) {
      //if property is owned by current player, continue
      updateByID(
        "messagePara",
        currentPlayer.name + ": You own this property. Thanks for visiting!"
      );
    } else {
      //charge rent
      updateByID(
        "messagePara",
        currentPlayer.name +
          ": This property is owned by " +
          currentSquareObj.owner +
          ". You owe $" +
          currentSquareObj.rent +
          ". You now have $" +
          currentPlayer.cash
      );

      var owner = game.players.filter(function(player) {
        return player.id == currentSquareObj.owner;
      });
      currentPlayer.updateCash(currentPlayer.cash - currentSquareObj.rent);
    }
  }

  //function to update inner HTML based on element ID
  function updateByID(id, msg) {
    document.getElementById(id).innerHTML = msg;
  }

  /****                       Constructor functions                             *****/

  /*constructor function for properties (game board squares)*/
  function Square(name, value, squareID) {
    //what is this property called?
    this.name = name;
    //what's the value/initial purchase price?
    this.value = value;
    //how much rent to charge when another player lands here? (30% of square value.)
    this.rent = value * 0.3;
    //where does this appear on the game board?
    this.squareID = squareID;
    //who owns the property? (initially unowned)
    this.owner = "For Sale";
  }

  /*constructor function for players*/
  function Player(name, cash, token, id) {
    this.name = name;
    this.cash = cash;
    this.token = token;
    this.id = id;
    this.currentSquare = "square1";
    this.ownedSquares = [];
  }

  //Add a method to create a player token span and add it to appropriate square
  //Adding it as a prototype of the Player constructor function
  Player.prototype.createToken = function(square) {
    var playerSpan = document.createElement("span");
    playerSpan.setAttribute("class", this.token);
    playerSpan.setAttribute("id", this.id);
    square.appendChild(playerSpan);
  };

  //method to update the amount of cash a player has
  Player.prototype.updateCash = function(amount) {
    document.getElementById(this.id + "-info_cash").innerHTML = amount;
    this.cash = amount;
  };

  return game;
})();
