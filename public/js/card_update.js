  var currentCard = 1;

// function nextCard() {
//   currentCard++;
//   nextCard =$(".container").children("div:nth-of-type("+String(currentCard)+")").css("display", "block");
// }


$(function() {
  $(".flip").flip({
    trigger: 'manual',
    axis: 'x'
  });

  var cards = $(".flip");

  for (var i = 1; i < cards.length; i++) {
    cards[i].style.display = "none";
  }

  $(".container").on("click", ".flip", function(){
    // This function handles the card animation for the play.ejs file. The
    // different transition animatios must only fire when the checkbox is filled.
    // the checkbox input is child of

    //If the front is showing and the subit button is not on the card

    if ( $(this).find(".front").css("z-index") == "1" && $(this).find("button").length == 0){
      $(this).flip(true);
    }
  });

  $(".container").on("click", "input[type='checkbox']", function() {

    var data = {
      cardId:this.name,
      isCorrect: (this.value === "correct")
    }

    $.post("/update_card", data)
    .done(function(res){
      console.log("cardupdated");
      console.log(res);
    })
    .fail(function(err){
      console.log(err);
    });

    var flip = $(this).parent().parent().parent();

    // If the back of the card is showing
    if(flip.find(".back").css("z-index") == "1"){
      flip.transition({
        animation:'fly down',
        // onComplete : nextCard
      });
      // onComplete does not identify nextCard to be a function on seond call
      // The Timeout function is used to wait the end of the animation before
      // displaying the next card{}
      setTimeout(function(){currentCard++;
          nextCard =$(".container").children("div:nth-of-type("+String(currentCard)+")").css("display", "block");}
          , 600);
    }
  });


});
