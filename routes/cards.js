var express = require("express"),
    router = express.Router({mergeParams:true});

var Category = require("../models/category.js"),
    Card     = require("../models/card.js"),
    time     = require("../middleware/time.js");

//Card creation route
router.get("/new", function(req,res){
  id = req.params.id;
  Category.findById(id, function(err, category){
      res.render("card/new", {category:category,
                              username: req.user.username});
  });
});

//Post request obtained from card creation route
router.post("/", function(req,res){
  id = req.params.id;

  Category.findById(id, function(err, category){
    if (err){
      console.log(err);
    }

    else {
      var card = req.body.card;
      card.timeStamp = time.getDay();
      card.consecutiveRightAnswers = 0;
      Card.create(card, function(err,card){
            if (err) {
              console.log(err);
            }
            else {
              category.cards.push(card._id);
              category.nb_cards++;
              category.save();
              res.redirect("/categories/"+id+"/edit");
            }
      });
    }
  });
});

// You will be redirected from the edit category page if you decide to edit a card
router.get("/:card_id/edit", function(req,res) {
  id=req.params.id;
  Category.findById(id, function(err, category){
    Card.findById(req.params.card_id, function(err, card){
      res.render("card/edit", {category:category,
                              card:card,
                              username: req.user.username});
    });
  });
});

//accessed by the category_edit page
router.put("/:card_id/", function(req,res) {
  Card.findByIdAndUpdate(req.params.card_id, req.body.card, function(err, card){
    if (err){
      console.log(err);
    }
    else {
        res.redirect("/categories/"+req.params.id+"/edit");
    }
  });
});




//accessed by the category_edit page
router.delete("/:card_id", function(req,res) {
  // Does this delete it from the array as well????
  // Do we need to populate??
  Category.findById(req.params.id, function(err, category){
    if (err){
      console.log(err);
    }
    else {

      //This snipet of code deletes the card of the category array
      //TODO: turn this into a method once you learn about prototyping
      for (var i = 0; i < category.cards.length; i++) {
        if (category.cards[i].toString()===req.params.card_id.toString()){
          category.cards.splice(i,1);
          category.nb_cards--;
          break;
        }
      }
      category.save();


      Card.findByIdAndDelete(req.params.card_id, function(err, card){
        if (err) {
          console.log(err);
        }
        else {
          res.redirect("/categories/"+req.params.id+"/edit");
        }
      });
    }
  })
  //For some reason this does not delete the card

});

module.exports =router;
