var data = [
    ["Get the plague, loose 5 tiles", 0.2, -5],
    ["Get the plague, loose 2 tiles", 0.2, -2],
    ["Move 2 tiles.", 6, 2],
    ["Move 3 tiles.", 4, 3],
    ["Get stuck in the snow, loose 2 tiles.", 1, -2],
    ["Move 1 tiles.", 7, 1],
    ["Move 9 tiles.", 0.9, 9],
    ["You ate raw meet, loose 2 tiles.", 1, -2],
    ["You go over hilly ground, loose 1 tile.", 0.8, -1],
    ["You got the typhoid fever, loose 2 tiles", 0.4, -3],
    ["You got dysentery, loose 3 tiles", 0.2, -3],
    ["You got Cholera, loose 3 tiles", 1, -3],
    ["You meet a nice group of Indians, they help you along 2 tiles.", 0.4, 2],
    ["You met a mean group of Indians, they fought you off. Loose 2 tiles.", 0.7, -2],
    ["Uh Oh! Your wagon wheel broke, loose 1 tiles.", 0.6, -1],
    ["Run into buffalo, strike it rich with meet. Move 2 tiles.", 2, 2],
    ["Run into buffalo, they ran over your wagon. Loose 1 tiles.", 0.7, -1],
    ["You've ran out of wood. Loose 1 tile.", 1, -1],
    ["You've gotten mauled by a bear. Loose 3 tiles.", 0.1, -3],
  ];
begText1 = document.getElementById("tile").innerHTML;
buttonText = document.getElementById("buttonRoll").innerHTML;
betText = "To play the game, press roll again and your tile will move. Your goal is to get to the end without loosing more than 30 tiles in one game. Good luck!";
if(document.getElementById("tile").innerHTML == "To play the game, press roll again and your tile will move. Your goal is to get to the end without loosing more than 30 tiles in one game. Good luck!"){
    document.getElementById("buttonRoll").innerHTML = "Start game!";
    let playerSpot = sessionStorage.setItem("playerSpot", 1);
    document.getElementById("s1-owner").classList.add("triangle");
  }else{
    document.getElementById("buttonRoll").innerHTML = "Roll again!";
}
  let playerSpot = sessionStorage.getItem("playerSpot");
  //document.getElementById("tile").innerHTML = getTile();
  function getTile() {
  let out = [];
  let playerSpot = sessionStorage.getItem("playerSpot");
  document.getElementById("s"+playerSpot+"-owner").classList.remove("triangle");
  if(playerSpot >= 30){
    wonGame()
  }
  
  // Loop through the master entries.
  for (let i = 0; i < data.length; ++i) {
      // Push the value over and over again according to its
      // weight.
      for (let j = 0; j < data[i][1]; ++j) {
          out.push([data[i][0], data[i][2]]);
          //num.push(data[i][2]);
      }
  }
  
  // And done!
  let output = out[Math.floor(Math.random() * out.length)];
  let text = spliceIntoChunks(output, 1);
  let text1 = parseInt(text[1], 10);
  
  let calcEnd = playerSpot + text1;
  console.log("CalcEnd: " + calcEnd);
  if (calcEnd < 1) {
    if(playerSpot < 1){
      sessionStorage.setItem("playerSpot", 1);
      getTile();
    }else{
    getTile();
    }
  }
  moveTile(text[1], playerSpot)
  return text[0];
  //return num[Math.floor(Math.random() * num.length)];
}
function newRoll(){
    document.getElementById("tile").innerHTML = "";
    document.getElementById("tile").innerHTML = getTile();
    document.getElementById("buttonRoll").innerHTML = "Roll again!";
}
function moveTile(amount, playerSpot1){
  let amount1 = parseInt(amount, 10);
  let play1 = parseInt(playerSpot1, 10);
  var updatedSpot = play1 + amount1;
  if (updatedSpot < 1) {
    getTile();
  }
  if(updatedSpot > 30){
    wonGame()
  }
  let playerSpot = sessionStorage.setItem("playerSpot", updatedSpot);
  document.getElementById("s"+updatedSpot+"-owner").classList.add("triangle");
  return console.log("You moved "+amount+" tiles. Updated spot: "+updatedSpot);
  
}
function wonGame (){
  window.location.replace("./won.html");
}
function spliceIntoChunks(arr, chunkSize) {
  const res = [];
  while (arr.length > 0) {
      const chunk = arr.splice(0, chunkSize);
      res.push(chunk);
  }
  return res;
}
//const arr = ["hello mason", 2];
//var testing = spliceIntoChunks(arr, 1)
//console.log(testing[1]);
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