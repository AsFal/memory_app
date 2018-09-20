
/** @global */
var currentCard = 1;


// On page load
$(function() {



  /** @global */
  var cards = $(".flip");
  /** Configure the card flip mechanism so the cards flip on the x axis
  * @requires jquery.flip
  */
  cards.flip({
    trigger: 'manual',
    axis: 'x'
  });

// initialize all of the cards in the deck as not being displayed
// except the first
  for (var i = 1; i < cards.length; i++) {
    cards[i].style.display = "none";
  }


/**
* Event that triggers when the displayed card (which will be on the question
* side) is clicked.
*
* @event jquery#click
*/

$(".container").on("click", ".flip", function(){

  /**
  * The first condition (left of the &&) checks if the front of the
  * clicked card is at the front of the z-axis. This makes sure the card
  * only flips if it is question side up. The answer side transition is
  * handled by the input click event (next one).
  *
  * The second condition (right of the &&) checks if there is the presence
  * of a submit button on the card (which would mean that the card is the
  * last one and should not be flipped).
  */
  if ( $(this).find(".front").css("z-index") == "1" && $(this).find(".ui.button").length == 0){
    $(this).flip(true);
  }
});

/**
* Event that triggers when one of the two checkboxes are clicked on the answer
* side of the card.
*
* @event jquery#click
*/
  $(".container").on("click", "input[type='checkbox']", function() {

    var data = {
      cardId:this.name,
      isCorrect: (this.value === "correct")
    }

    /** Post information sent with the card name and the correctness of the
    answer. Will update the database on the server side.
    **/
    $.post("/update_card", data)
    .done(function(res){
      console.log("cardupdated");
      console.log(res);
    })
    .fail(function(err){
      console.log(err);
    });

    /**
    * @this here represents the isCorrect checkbox input
    * The immediate parent is the encompassing form
    * The parent of the form is div that defines the card side
    * The parent of the card side div is the card itself (div.flip)
    */
    var flip = $(this).parent().parent().parent();

    /**
    * This condition checks if the back of the card is showing
    */
    if(flip.find(".back").css("z-index") == "1"){
      flip.transition({
        animation:'fly down',
        // onComplete : nextCard
      });
      /**
      * @todo: find out why the onComplete preperty of the argument object
      * can't execute nextCard, which would be a function equivalent to the
      * callback in the seTimeout function.
      */

      /**
      * The setTimeout tries to simulate the onComplete property of the
      * transition fucntion by estimating the time the transition takes, waiting
      * that time and displaying the next card.
      */
      setTimeout(function(){currentCard++;
          nextCard =$(".container").children("div:nth-of-type("+String(currentCard)+")").css("display", "block");}
          , 600);
    }
  });
});
