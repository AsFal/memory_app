// using jquery for selectors and animation
// Script for the play.ejs

// card_counter = lenght of ul (we have a list of questions)
// li elements are cards
// on the card click, we check wether the answer is revealed or the
// question is revealed.
// If question is revealed, show answer,
// If Answer is revealed, show next card
// In ejs, everything begins as hidden
// When the file runs, it unhides question 1.

//TODO: Make it so the answer is hiddent and only appear when we click on the
// the card (may have to play with the default ejs)

// SO that all the cards start in the base front mode
$(".flip").flip({
  trigger: 'manual',
  axis: 'x'
});

var currentCard = 1;

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
// $(this).find(".front").css("z-index") == "1"


$(".container").on("click", "input[type='checkbox']",
function(){
  var flip = $(this).parent().parent().parent();

  // If the back of the card is showing
  if(flip.find(".back").css("z-index") == "1"){
    flip.transition('fly down');

    // The Timeout function is used to wait the end of the animation before
    // displaying the next card
    setTimeout(function(){currentCard++;
        nextCard =$(".container").children("div:nth-of-type("+String(currentCard)+")").css("display", "block");}
        , 600);
  }

});


//TODO: Double-click to skip the question (for whatever reason)
