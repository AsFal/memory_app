var mongoose  = require("mongoose");
var Card            = require("./models/card.js"),
    Category        = require("./models/category.js"),
    User            = require("./models/user.js"),
    Client          = require("./models/client.js");

// connect lorem IPSUM API to make general functions here

function remove(username){
  Card.remove(function(err){
    if(err){
      console.log(err);
    }
    else {
      console.log("All cards deleted!");
    }
  });
  Category.remove(function(err){
    if(err){
      console.log(err);
    }
    else {
      console.log("All Categories deleted!");
    }
  });

  User.findOne({username:username}, function(err, user){
    Client.findOneAndUpdate({user:user._id},
      {
        categories:[]
      }, function(err, client){
      // // while(client.categories.length != 0){
      // //   console.log(client.categories.pop());
      // // }
      // // client.categories = [];
      // // console.log(client);
      // // console.log("Client no longer has associated categories");
      // // console.log(client);
      // client.save(function(err){
      //   if(err){
      //     console.log("==========ERR==========");
      //     console.log(err);
    });
  });
}



function seed_AsFal(){
  remove("AsFal");
  category = new Category({
    title:"Digits of Pi pie",
    description: "This category is meant to help you memorize the digits of pi",
    image:"https://www.readthespirit.com/feed-the-spirit/wp-content/uploads/sites/19/2015/02/Pi-pumkin-by-Steph-Goralnick.png",
    nb_cards:0,
    cards:[]
  })
  console.log(category);

  var pi = [3,1,4];
  for (var i = 0; i < pi.length; i++) {
    card = new Card({
      question:"Digit "+String(i+1),
      answer: String(pi[i]),
      timeStamp:i,
      consecutiveRightAnswers:0
    })
    category.cards.push(card._id);
    card.save();
    category.nb_cards++;
  }
  category.save();

  User.findOne({username:"AsFal"}, function(err, user){
    Client.findOne({user:user._id}, function(err, client){
      client.categories.push(category._id);
      client.save();
    });
  });


  console.log(category);
  console.log("End of seed function");
}

module.exports = {seed_AsFal:seed_AsFal};



//=========================================================
//==========General Seed function (Incomplete)=============
//=========================================================
// function contentGenerator(filename)
// {
//   // Reading information from files in javascript
//   // returning a piece of this information for the user to use
//   // return content object
// }

// function seed(username, filename){
//   remove(username);
//   var content = contentGenerator(filename);
//   category = new Category({
//     title:content.title,
//     description: content.description,
//     image:content.image,
//     nb_cards:0,
//     cards:[]
//   })
//   console.log(category);
//
//   for (var i = 0; i < content.cards.length; i++) {
//     card = new Card({
//       question:content.cards[i].question,
//       answer: content.cards[i].question,
//       timeStamp:i,
//       consecutiveRightAnswers:0
//     })
//     category.cards.push(card._id);
//     card.save();
//     category.nb_cards++;
//   }
//   category.save();
//
//   User.findOne({username:username}, function(err, user){
//     Client.findOne({user:user._id}, function(err, client){
//       client.categories.push(category._id);
//       client.save();
//     });
//   });
//   console.log(category);
// }
