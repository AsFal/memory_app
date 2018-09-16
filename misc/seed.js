var mongoose  = require("mongoose"),
    fs        = require("fs"),
    _         = require('lodash');
var Card            = require("./models/card.js"),
    Category        = require("./models/category.js"),
    User            = require("./models/user.js"),
    Client          = require("./models/client.js");


// NOTE:
// we can require the json Object 2 ways
// var seed = require("./seeds/digits_of_pi.json");
// or by using the fs package (which needs to be installed
// with npm)
// The function fs.readFileSync(file_name) lets you read
// files with node.js

/**
 * This function takes a mongoose Document and converts into a Js object while
 * also deleteing the id and version properties of the document.
 *
 * @param {Document} mongooseDocument
 *   A mongoose document that will be transformed into a formatted js document.
 *
 */
function documentToFormattedObject(mongooseDocument) {
  if (_.get(obj, 'constrcutor.base') instanceof mongoose.Mongoose  ){
    var temp = mongooseDocument.toObject();
    delete temp._id;
    delete temp.__v;
    return temp;
  }
}

/**
 * This function makes a number of async queries to MongoDB to generate lists
 * of cards and categories. Once all of the callbacks have completed, the two
 * lists are then converted into a JS object and exported to a JSON file
 *
 * @param {Array} highList
 *   An array of mongoose documents that contain a property that is an array
 *   of objects contained in lowList
 * @param {Array} lowList
 *   An array of mongoose documents that will be organized in the associated
 *   porperty of the mongoose documents contained in highList
 * @param {String} property
 *   The name of the property in the highList documents that contain a list of
 *  lowList document ids.
 *
 * @return
 *   An array of js objects that
 */
function associateLevels(highList, lowList, property) {
  var tempHighList = []
  highList.forEach(function(highDocument) {
    var highObject = documentToFormattedObject(highDocument);
    delete highObject._id;
    delete highObject.__v;
    var associatedLowers = [];
    highDocument[property].forEach(function(lowId) {
      lowList.forEach(function(lowDocument){
        if(lowDocument._id.toString() === lowId.toString()){
          associatedLowers.push(documentToFormattedObject(lowDocument));
        }
      });
    });
    highObject[property] = associatedLowers;
    tempHighList.push(highObject);
  });
  return tempHighList;
}

function pinchList(seperatedDocumentLists, propertyList) {
  if (seperatedDocumentLists.length == 2) {
    return associateLevels(seperatedDocumentLists[0], seperatedDocumentLists[1], propertyList[0]);
  }
  else {
    var first = seperatedDocumentLists.shift();
    var firstProperty = propertyList.shift();
    return associateLevels(first, pinchList(seperatedDocumentLists, propertyList), firstProperty);
  }
}

// NOTE: This function could be refactored into two seperate and more reusable
// function
// An association function that returns the higher level array (Categories) with
// the associated lower level objects organized (Cards)
// A second function that generates the object from an array of different level
// arrays

/**
 * This function prints a Js object to a json file in the seeds folder. This
 * function uses the async fs package to do so.
 *
 * @param {object} object
 *   The object that will be exported to the JSON file
 * @param {String} fileName
 *  the name of the JSON file to which the js object will be exported
 *
 */
function printObjectToJSON(object, fileName){
  var json = JSON.stringify(object);
  fs.writeFile("seeds/"+fileName, json, 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
  });
}

/**
 * This function makes a number of async queries to MongoDB to generate lists
 * of cards and categories. Once all of the callbacks have completed, the two
 * lists are then converted into a JS object and exported to a JSON file
 *
 * @param {String} username
 *   The username of the accound who's data will be exported to a json file
 * @param {String} fileName
 *  The name of the Json file to which the data will be exported.
 *
 */


function fetchCard (cardId) {
  return new Promise(function(fulfill,reject) {
    Card.findById(cardId, (err, card) => {
      if(err) {
        console.log(err)
      }
      else {
        card = documentToFormattedObject(card);
        fulfill(card);
      }
    });
  });
}

function fetchCategory(categoryId) {
  return new Promise(function(fulfill, reject) {
    Category.findById(categoryId, (err, category) => {
      if (err) {
        console.log(err);
      }
      else {
        category = documentToFormattedObject(category);

        cardPromises = [];
        category.cards.forEach(cardId=> {
          cardPromises.push(fetchCard(cardId));
        })

        Promise.all(cardPromises)
        .then(
          cards=> {

          category.cards = cards;
          fulfill(category);
          },
          err => {
            console.log(err);
          });
      }
    });
  });
}

// var object = {categories:pinchList([categories, cards], ["cards"])};
// let printPromise =  printObjectToJSON(object, fileName);
// printPromise.then((data)=> {
//   fulfill('Data has been extracted to JSON');
// },
// (err)=> {
//   console.log(err);
// })

function extractDataIntoJSON(username, fileName) {
  return new Promise(function(fulfill, reject) {
    let clientPromise = fetchClient();
    clientPromise.then(
      client => {
        categoryPromises = []
        client.categories.forEach(categoryId => {
          categoryPromises.push(fetchCategory(categoryId))
        });
        Promise.all(categoryPromises)
        .then(
          categories => {
            var object = {categories};
            let printPromise = printObjectToJSON(object, fileName);
            printPromise.then( () => {
              fulfill('Data has been exdtracted to JSON');
            },
            err => {
              console.log(err);
            });
          },
          err => {
            console.log(err);
          }
        )
      },
      err => {
        console.log(err);
      });
    }
}
// NOTE:
// https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js
// Current problem
// I need to find a way for the create Object function to wait for the fetchData function to finish before begin called.
// I could create two function, one to fetch the Categories and one for the cards, but the problem here lies that
// i need to return these objects out of the function to be able to access them and I only have access to these objects in the call back
// I could make the make object async, but it would then be racing with all the mongoose callbacks


function deleteAllCategories(categoryIds) {
  return new Promise(function(fulfill, reject) {
    let lastId = categoryIds[categoryIds.length -1];
    let cardIds = [];
    categoryIds.forEach(categoryId => {
      Category.findByIdAndDelete(categoryId, (err, category) => {
        cardIds = cardIds.concat(category.cards);
        if (category._id.toString() === lastId.toString()) {
          fulfill(cardsIds)
        }
      })
    })
  })
}

function deleteAllCards(cardIds) {
  cardIds.forEach(cardId => {
    Card.findByIdAndDelete(cardId);
  });
}



/**
 * This function makes a number of async queries to MongoDB to generate lists
 * of cards and categories. Once all of the callbacks have completed, the two
 * lists are then converted into a JS object and exported to a JSON file
 *
 * @param {String} username
 *   The username of the accound who's data will be deleted
 *
 */
function eraseData(username){

  console.log(username+"'s data will be erased.");
  return new Promise(function(fulfill, reject) {
    let clientPromise = fetchClient();
    clientPromise.then(client => {
      deleteAllCategories(client.categories)
      .then(function(cardIds){
        deleteAllCards(cardIds)
      },
      function(err) {
        console.log(err);
      })
      .then(
        client.categories = [];
        client.save()
        .then(() => {
          fulfill();
        })
      ))
      })
    },
    err => {

    });


    User.findOne({username:username}, function(err, user){
      Client.findOne({user:user._id}, function(err, client){
        let lastCategoryId = client.categories[client.categories.length - 1];
        client.categories.forEach(function(categoryId){
          Category.findByIdAndDelete(categoryId, function(err, category){
            let lastCardId = category.cards[category.cards.length-1];
            category.cards.forEach(function(cardId){
              Card.findByIdAndDelete(cardId, function(err, card){
                if (err) {
                  console.log(err);
                }
                else if(category._id.toString() === lastCategoryId.toString()
                        && card._id.toString() === lastCardId.toString()) {
                    fulfill('Accounts data has been deleted');
                }
              });
            });
          });
        });
      });
    });
    User.findOne({username:username}, function(err, user){
      Client.findOneAndUpdate({user:user._id},
        {
          categories:[]
        }, function(err, client){
      });
    });
  });
}
// Doesnt erase everything the way it should

/**
 * This function makes a number of async queries to MongoDB to generate lists
 * of cards and categories. Once all of the callbacks have completed, the two
 * lists are then converted into a JS object and exported to a JSON file
 *
 * @param {String} username
 *   The username of the accound who's data will be deleted
 * @param {String} fileName
 *  The name of the JSON file from which we will extract the data to seed the
 *  the DB.
 */
function seedData(username, fileName){

  console.log(username+" will be seeded with data.")
  var categories = [];
  var cards = [];
  var seed = require("./seeds/" + fileName);

  return new Promise (function(fulfill, reject) {
    let clientPromise = fetchClient();
    clientPromise.then(client => {
      for (var i = 0; i < seed.categories.length; i++) {
        categories.push(new Category({
          title:seed.categories[i].title,
          description: seed.categories[i].description,
          image:seed.categories[i].image,
          nb_cards:seed.categories[i].nb_cards,
          cards:[]
        }));

        client.categories.push(categoryList[i]._id);

        for (var j = 0; j < seed.categories[i].cards.length; j++) {
          var card = new Card({
            question:seed.categories[i].cards[j].question,
            answer: seed.categories[i].cards[j].answer,
            timeStamp:seed.categories[i].cards[j].timeStamp,
            consecutiveRightAnswers:seed.categories[i].cards[j].consecutiveRightAnswers
          })
          categoryList[i].cards.push(card._id);
          cards.push(card);
        }

        let saveAllPromise = Promise.all(
          saveAll(categories);
          saveAll(cards);
          saveClient(client);
        );
        saveAllPromise.then(()=> {
            fulfill('db has been seeded');
          },
          err => {
            console.log(err);
          }
        );
      }
    })
  });
  });

}

function fetchClient(username) {
  return new Promise(function(fulfill, reject) {
    User.findOne({username:username}, function(err, user){
      Client.findOne({user:user._id}, function(err, client){
        fulfill(client);
      });
    });
  });
}

function saveAll(iterable) {
  return new Promise(function(fulfill, reject) {
    let lastItem = iterable[iterable.length - 1];
    iterable.forEach(function(item) {
      item.save(function(err) {
        if(err) {
          console.log(err);
        }
        else if(item === lastItem ) {
          fulfill();
        }
      });
    });
  });
}



module.exports = {seedData:seedData,
                  extractDataIntoJSON:extractDataIntoJSON,
                  eraseData:eraseData};
