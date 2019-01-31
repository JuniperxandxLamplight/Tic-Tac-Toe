function Player(mark) {
  this.mark = mark;
}

function Space(x,y) {
  this.x = x;
  this.y = y;
  this.player = "";
}

Space.prototype.mark = function(player) {
  this.player = player;
}

Space.prototype.markedBy = function() {
  return this.player;
}

function Board() {
  this.spaces = [];
}

Board.prototype.build = function() {
  var boardString = "";
  var spaces = [];
  var currentSpace;
  for (var i = 0; i < 3; i++) {
    boardString += "<div class='row'>";
    for (var j = 0; j < 3; j++) {
      boardString += "<div value = '"+i+j+"' class='openSquare col-md-4' id='space" + i + j + "'></div>";
      currentSpace = new Space(i,j);
      spaces.push(currentSpace);
    }
    boardString += "</div>";
  }
  $("#board").append(boardString);
  this.spaces = spaces;
}

Board.prototype.find = function(x,y) {
  if (this.spaces) {
    for (var i = 0; i < this.spaces.length; i++) {
      if (this.spaces[i].x == x && this.spaces[i].y == y) {
        return this.spaces[i];
      } else {
      }
    }
  }
  return false;
}

function Game() {
  this.player1 = new Player("X");
  this.player2 = new Player("O");
  this.board = new Board;
  this.turn = 1;
  this.end = false;
}

Game.prototype.endTurn = function() {
  this.turn = this.turn == 1 ? 2 : 1;
}

function checkGame(squares) {
  if (squares.length >= 5) {
    for (var i = 0; i < squares.length - 2; i++) {
      for (var j = i + 1; j < squares.length - 1; j++) {
        if (squares[i].markedBy() == squares[j].markedBy()) {
          for (var k = j + 1; k < squares.length; k++) {
            if (squares[i].markedBy() == squares[k].markedBy()) {
              if (((squares[i].x == squares[j].x) && (squares[i].x == squares[k].x)) || ((squares[i].y == squares[j].y) && (squares[i].y == squares[k].y)) || ((squares[i].x == squares[i].y) && (squares[j].x == squares[j].y) && (squares[k].x == squares[k].y)) || ((squares[i].x == (2 - squares[i].y)) && (squares[j].x == (2 - squares[j].y)) && (squares[k].x == (2 - squares[k].y)))) {
                $("#space" + squares[i].x + squares[i].y).css("background-color","red");
                $("#space" + squares[j].x + squares[j].y).css("background-color","red");
                $("#space" + squares[k].x + squares[k].y).css("background-color","red");
                return squares[i].markedBy();
              }
            }
          }
        }
      }
    }
  }
  return false;
}


var player = 1;
var winner = 0;
var squaresFilled = [];
var done = false;;

function twoPlayer(game,board) {
  $("#result").toggle();
  $("#board").toggle();
  $("#btn-well").toggle();

  $("#result").text("Player " + game.turn + "'s Turn");

  $("#board").on("click",".openSquare", function() {

    var activePlayer = "player" + game.turn;

    $(this).append("<h1 class='markedCell'>" + game[activePlayer].mark + "</h1>");

    var activeSpace = board.find(this.id[5],this.id[6]);
    activeSpace.mark(game[activePlayer].mark);
    squaresFilled.push(activeSpace);
    $(this).removeClass("openSquare");
    $(this).addClass("clickedOne");

    done = checkGame(squaresFilled);
    if (done) {
      $("#result").text("Winner: Player " + game.turn);
      $(".openSquare").addClass("clickedOne");
      $(".openSquare").removeClass("openSquare");
    } else {
      game.endTurn();
      $("#result").text("Player " + game.turn + "'s Turn");
    }
  });
}

function onePlayer(game,board) {
  $("#btn-well").toggle();
  $("#dif-well").toggle();
  $("#easy").click(function() {
    $("#dif-well").toggle();
    easyMode(game,board);
  });
  $("#hard").click(function() {
    $("#dif-well").toggle();
    hardMode(game,board);
  });
}

function easyMode(game,board) {
  $("#result").toggle();
  $("#board").toggle();
  var allSpaces = board.spaces;
  var openSpaces = [];
  var gameOver = false;
  var compChoice;
  var compX;
  var compY;

  $("#board").on("click",".openSquare", function() {
    var activePlayer = "player" + game.turn;

    $(this).append("<h1 class='markedCell'>" + game[activePlayer].mark + "</h1>");

    var activeSpace = board.find(this.id[5],this.id[6]);
    activeSpace.mark(game[activePlayer].mark);
    squaresFilled.push(activeSpace);
    $(this).removeClass("openSquare");
    $(this).addClass("clickedOne");

    done = checkGame(squaresFilled);
    allSpaces.splice((parseInt(this.id[5]) * 3 + parseInt(this.id[6])) , 1, '');
    openSpaces = allSpaces.filter(arr => arr != '');
    if (done) {
      if (game.turn == 1) {
        $("#result").text("Winner: Human");
      } else {
        $("#result").text("Winner: Computer");
      }
      $(".openSquare").addClass("clickedOne");
      $(".openSquare").removeClass("openSquare");
    } else {
      game.endTurn();


      compChoice = Math.floor((openSpaces.length) * Math.random());
      compX = openSpaces[compChoice].x;
      compY = openSpaces[compChoice].y;
      compSquare = $("#space" + compX + compY);

      var activePlayer = "player" + game.turn;

      $(compSquare).append("<h1 class='markedCell'>" + game[activePlayer].mark + "</h1>");

      var activeSpace = board.find(compSquare[0].id[5],compSquare[0].id[6]);
      activeSpace.mark(game[activePlayer].mark);
      squaresFilled.push(activeSpace);
      compSquare.removeClass("openSquare");
      compSquare.addClass("clickedOne");

      done = checkGame(squaresFilled);
      allSpaces.splice((parseInt(compSquare[0].id[5]) * 3 + parseInt(compSquare[0].id[6])) , 1, '');
      openSpaces = allSpaces.filter(arr => arr != '');
      game.endTurn();
    }
  });

}

function hardMode(game,board) {
  $("#result").toggle();
  $("#board").toggle();
  var allSpaces = board.spaces;
  var openSpaces = [];
  var markedSpaces = [];
  var gameOver = false;
  var compChoice;
  var compX;
  var compY;

  $("#board").on("click",".openSquare", function() {
    var activePlayer = "player" + game.turn;

    $(this).append("<h1 class='markedCell'>" + game[activePlayer].mark + "</h1>");

    var activeSpace = board.find(this.id[5],this.id[6]);
    activeSpace.mark(game[activePlayer].mark);
    squaresFilled.push(activeSpace);
    $(this).removeClass("openSquare");
    $(this).addClass("clickedOne");

    done = checkGame(squaresFilled);
    markedSpaces = function(){
      var markedSpace = allSpaces. ((parseInt(this.id[5]) * 3 + parseInt(this.id[6])) , 1, ''); //remove marked space from open space array
      markedSpaces.unshift(markedSpace); //move marked space to marked space array at index 0
    }
    // allSpaces.splice((parseInt(this.id[5]) * 3 + parseInt(this.id[6])) , 1, '');
    openSpaces = allSpaces.filter(arr => arr != '');
    if (done) {
      if (game.turn == 1) {
        $("#result").text("Winner: Human");
      } else {
        $("#result").text("Winner: Computer");
      }
      $(".openSquare").addClass("clickedOne");
      $(".openSquare").removeClass("openSquare");
    } else {
      game.endTurn();

      // to do: take marked space array, check index 0 and determine where to mark based on index of player's move 

      compX = openSpaces[compChoice].x;
      compY = openSpaces[compChoice].y;
      compSquare = $("#space" + compX + compY);

      var activePlayer = "player" + game.turn;

      $(compSquare).append("<h1 class='markedCell'>" + game[activePlayer].mark + "</h1>");

      var activeSpace = board.find(compSquare[0].id[5],compSquare[0].id[6]);
      activeSpace.mark(game[activePlayer].mark);
      squaresFilled.push(activeSpace);
      compSquare.removeClass("openSquare");
      compSquare.addClass("clickedOne");

      done = checkGame(squaresFilled);
      allSpaces.splice((parseInt(compSquare[0].id[5]) * 3 + parseInt(compSquare[0].id[6])) , 1, '');
      openSpaces = allSpaces.filter(arr => arr != '');
      game.endTurn();
    }
  });
}

$(document).ready(function() {
  var newGame = new Game;
  var newBoard = newGame.board;
  newBoard.build();

  $("#onePlayer").click(function() {
    onePlayer(newGame,newBoard);
  });
  $("#twoPlayer").click(function() {
    twoPlayer(newGame,newBoard);
  });
});
