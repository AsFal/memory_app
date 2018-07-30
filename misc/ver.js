var Card = require("./models/card.js"),
    Category = require("./models/category.js"),
    mongoose        = require("mongoose");


function callThis() {
  var cardP, categoryP;
  Card.findOne({"question":"Digit 1"}, function(err, card){
    console.log(card);
    console.log(card.__proto__);
    console.log(Card.prototype);
    console.log("============================================");
    console.log(card.__proto__ === Card.prototype);
    console.log("============================================");
    object = card.toObject();
//

    cardP = card.__proto__.__proto__;
    if(categoryP) {
      console.log(cardP === mongoose.model.prototype)
      // console.log()
    }

  })

  Category.findOne({"title":"Digits of pi"}, function(err, category){
    console.log(category);
    console.log(category.__proto__);
    console.log(Category.prototype);

    categoryP = category.__proto__.__proto__;
    if(cardP) {
      console.log(cardP === Card.prototype.prototype)
      // console.log()
    }
  })
}

module.exports = callThis;
