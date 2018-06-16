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
$(".card").flip();

var currentCard = 1;

var cards = $(".card");

for (var i = 1; i < cards.length; i++) {
  cards[i].style.display = "none";
}
//
$(".container").on("click", ".card", function(){
  //If the front is showing
  if ($(this).find(".front").css("z-index") == "1"){
    $(this).flip();
  }
  // If the back is showing (i.e. the answer of the question)
  else{
    $(this).css("display", "none");
    currentCard++;
    card =$(".container").children("div:nth-of-type("+String(currentCard)+")").css("display", "block");
    // for (var i = 0; i < cards.length; i++) {
    //   if (i == currentCard){
    //     var card = card[i];
    //     cards[i].style.display = "default";
    //     currentCard++;
    //   }
    // }
    // currentCard++;
    // var value = $("div:nth-child("+String(currentCard)+")");
    // $("ul:nth-child("+String(currentCard)+")").css("display","initial");
    //Show next card using the z-index
  }

});



// TODO: Make it so only one card appears at the time (i.e. the cards must look
// like a deck with one face up card)
// First click reveals the answer, second click reveals the question




//TODO: Double-click to skip the question (for whatever reason)

// TODO: add card flip and card discard animations (ADVANCED, I HAVE 0 idea
//how to do this
