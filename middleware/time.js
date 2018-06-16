
// 1528835458128 - > corresponds to 2018/06/12/16:31

const juneTwelth = 1528835458128; //Time elapsed between Junary 1 1970 midnight
//and   2018/06/12/16:31 in miliseconds
const juneThirteen = 1528862398128; //June thirteenth midnight
const milisecondsInADay = 86400000;
const milisecondsInAHour = 3600000;
const milisecondsInAMinute = 60000;


// changeThis for a dateTime API


function getDay(){
  var timeElapsedFromjuneTwelth = Date.now() - juneTwelth;
  var dayCount = 0;
  while (timeElapsedFromjuneTwelth - milisecondsInADay > 0) {
    dayCount++;
    timeElapsedFromjuneTwelth -= milisecondsInADay;
  }
  return dayCount;
}


function randomizeDeck(deck){
  chosenIndexes = [];
  for (var i = 0; i < deck.length; i++) {

    do {
      i = randomNumber();//
    } while (function(){
      chosenIndexes.foreach(function(index){
        if (i == index)
          return true;
        return false;
        });
      });
    deck.push(deck[i]);
    chosenIndexes.push(i);
  }
  deck.splice(0, deck.length);
}
  //Create randomization algorithm


//The category here follows the same model found in model/category.js
function addCardsToDeck(deck, category) {
  var day  = getDay();
  console.log("Day is" + String(day));
  category.cards.forEach(function(card){
    //The timeStamp on the card represents the day on which the card shouldve
    // been seen. If the timeStamp is smaller than the current day, then the day
    // on which it shouldve been added to the deck has passed and the card will
    // thus be added to the current deck
    if (card.timeStamp <= day) {
      deck.push(card);
    }
  });

  //Randomize deck
  // randomizeDeck(deck);
  //TODO:Add a card for the next day that will be partially hidden at the end of the
  // deck once the user has passed through the current deck

}



//Cards will also carry information about the number of consecutive wrong answers
function reclassifyCard(card, rightAnswer) {
  if (rightAnswer) {
    switch(card.consecutiveRightAnswers) {
      case 0:
        card.timeStamp += 3;
        card.consecutiveRightAnswers++;
        break;
      case 1:
        card.timeStamp += 7;
        card.consecutiveRightAnswers++;
        break;
      case 2:
        card.timeStamp +=14;
        card.consecutiveRightAnswers++;
        break;
      case 3:
        card.timeStamp +=30;
        card.consecutiveRightAnswers++;
        break;
      default:
        card.timeStamp +=60;
        card.consecutiveRightAnswers++;
    }
  }
  else {
    carte.timeStamp +=1;
    card.consecutiveRightAnswers = 0;
  }
}


module.exports={
  addCardsToDeck:addCardsToDeck,
  // getDay:getDay,
  // randomizeDeck:randomizeDeck,
  reclassifyCard:reclassifyCard
};
