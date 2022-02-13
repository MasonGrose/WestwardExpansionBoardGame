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
  function getTile() {
  let out = [];
  let playerSpot = sessionStorage.getItem("playerSpot");
  document.getElementById("s"+playerSpot+"-owner").classList.remove("triangle");
  if(playerSpot >= 30){
    wonGame()
  }
  for (let i = 0; i < data.length; ++i) {
      for (let j = 0; j < data[i][1]; ++j) {
          out.push([data[i][0], data[i][2]]);
      }
  }
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