var express   = require("express"),
    router    = express.Router(),
    Category  = require("../models/category.js"),
    User      = require("../models/user.js"),
    Client    = require("../models/client.js"),
    Card     = require("../models/card.js");



//Almost sure this is going to need some kind of require statement
function isLoggedIn(req,res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
/* The categories page is unique to each user. It displays all of the
 * categories, formatted in a way that we see the title, an image (chosen by the
 * user or the default image) and  the number of queue cards in the category
 */
router.get("/",isLoggedIn, function(req,res){


  Client.findOne({user:req.user._id}).populate("categories").exec(function(err, client){
    if (err){
      console.log(err);
    }
    else {
      res.render("category/index", {category_list:client.categories});
    }
  });
});
/* This get request shows a form to fill out to create a new category,
 * which after completion will be redirected to the create_card page.
 */
router.get("/new", function(req,res){
  res.render("category/new");
});

//Category Creation Post Request
router.post("/", function(req,res) {
  var title = req.body.title;
  var description = req.body.description;
  var image = req.body.image;


  if (!image){
    image = "/images/brain.jpg";
    // Need to find default image
  }
  //If I can alter the create function, then I could put this as part of the create
  Client.findOne({user:req.user.id}, function(err, client){
    if(err){
      console.log(err);
    }
    else{
      Category.create( {title:title,
                        description:description,
                        image:image,
                        nb_cards:0,
                        cards:[]},
                      function(err, category){
                        if(err)
                        {
                          console.log(err);
                        }
                        else {
                          {
                            client.categories.push(category._id);
                            client.save(function(err){
                              if(err){
                                console.log(err);
                              }
                            });
                            console.log("Category created");
                          }
                        }
                      });
      res.redirect("categories");
    }
  });

});

/* This get request renders the category page for category "x". This page
 * should have a start button which
 TODO: Asses Wether or not this request is still useful
 */
router.get("/:id", function(req,res){
  //get the id to pass as a paramter
  var id = req.params.id;

  Category.findById(id, function(err, category){
    if (err){
      console.log(err);
    }
    else {
        res.render("category/display", {category,category});
    }
  });
});

/* This get request renders a page which on it has a form similar to the one
 * on category/create, with underneath an array of queue cards which each have
 * a flip, edit and delete button (clicking on the card could also initiate the
 * flip)
 */
router.get("/:id/edit", function(req,res){
  //Extract the id from the get request
  var id = req.params.id;
  //Render the category edit page with the information from the cagtegory
  //found in the database (modify the ejs to do this)

  //This line handles the card population so that in the ejs we have access to the cards
  Category.findById(id).populate("cards").exec(function(err, category) {
    if (err)
    {
      console.log(err);
    }
    else {
      res.render("category/edit", {category, category});
    }
  });
});


//Put request that handles the information from the category edit form
router.put("/:id", function(req,res){
  //Extract the id from the put request
  var id = req.params.id;
  // Creating the updated category
  // var title = req.body.title;
  // console.log(title);
  // var description = req.body.description;
  // var image = req.body.image;

  // Making a new category here generates a new id which cannot be changed
  // (id is an immutable propery)

  Category.findByIdAndUpdate(id, req.body.category, function(err, category){
    if (err) {
      console.log(err);
    }
    else {
      console.log(category);
    }
  });
  //Modify the information in the database
  res.redirect("/categories");
});

// delete request that deletes the category with specific id
router.delete("/:id", function(req,res){

  // TODO: This method needs to delete all of the associated cards

  Client.findOne({user:req.user._id}, function(err, client){

    // This is almost the same bit of case as found in the card delete route.
    // TODO: Find a way to generelize this method
    for (var i = 0; i < client.categories.length; i++) {
      // NOTE: why do I have to turn it into a string
      if (client.categories[i].toString()===req.params.id){
        client.categories.splice(i,1);
        break;
      }
    }
    client.save();


    Category.findByIdAndDelete(req.params.id, function(err, category){
        if (err)
        {
          console.log(err);
        }
        else {
          category.cards.forEach(function(card){
            Card.findByIdAndDelete(card._id, function(err, card){
              if(err){
                console.log(err);
              }
              else {
                console.log("card has been deleted");
              }
            });
          })
          console.log("Category has been deleted");
        }
    });
    //Delete the category with the given id from the database
    // (we should be waiting)
    res.redirect("/categories");
  });


});



module.exports =router;
