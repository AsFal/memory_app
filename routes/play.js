var express = require("express"),
    router = express.Router({mergeParams:true}),
    Category = require("../models/category.js"),
    Card = require("../models/card.js"),
    time = require("../middleware/time.js");




// this get request brings the user to the present day's stack of queue cards
router.get("/categories/:id/play", function(req,res){
  Category.findById(req.params.id).populate("cards").exec(function(err, category){
    if(err){
      console.log(err);
    }
    else {
      console.log(category.cards);
      var deck = [];
      deck = time.generateDeck(category.cards, time.getDay());
      //For some reason module does not export the functions called in the sent
      // functions, so I have to find a way to export them as well

      res.render("play", {deck:deck,
                          category: category,
                          username: req.user.username});
    }
  })
});


router.post("/update_card", function(req, res){
  console.log(req.body);
  console.log(req.body.cardId);
  Card.findById(req.body.cardId, function(err, card) {
    console.log(card);
    time.reclassifyCard(card, req.body.isCorrect);
    card.save();
  });
  res.send("success");
})



module.exports = router;
