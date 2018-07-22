var express = require("express"),
    router = express.Router({mergeParams:true}),
    Category = require("../models/category.js"),
    Card = require("../models/card.js"),
    time = require("../middleware/time.js");




// this get request brings the user to the present day's stack of queue cards
router.get("/", function(req,res){
  Category.findById(req.params.id).populate("cards").exec(function(err, category){
    if(err){
      console.log(err);
    }
    else {
      var deck = [];
      time.addCardsToDeck(deck, category);
      //For some reason module does not export the functions called in the sent
      // functions, so I have to find a way to export them as well

      res.render("play", {deck:deck, category: category});
    }
  })

});

router.post("/", function(req,res){



  var deck = [];
  // Check if the deck information is passed in the post request (or a way to do so)
  Category.findById(req.params.id).populate("cards").exec(function(err,category){
    if (err) {
      console.log(err)
    }
    else {
      time.addCardsToDeck(deck, category);

      for (var i = 0; i < deck.length; i++) {

        // boolean variable that indicates if the card was correctly answered
        // or not
        var isCorrect = req.body.correct[deck[i]._id] == "off,on";
        console.log("Answer is Correct: " +  String(isCorrect));
        console.log(deck[i]);
        var update = time.reclassifyCard(deck[i], isCorrect);
        console.log(update);
        Card.findByIdAndUpdate(deck[i]._id, update, function(err, card){
          if(err){
            console.log(err)
          }
          else {
            console.log(card);

          }
        })
      }
    }
  })

  res.redirect("/categories");
})



module.exports = router;
