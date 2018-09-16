/**
* @file intercepts post submits and makes a verification on the image valididty
* @author Alexandre Falardeau
*
* the testImage function comes from this source
* https://stackoverflow.com/questions/9714525/javascript-image-url-verify
*
* @todo: find if this can be done in the back end
*/


/**
* @function checks if an given path will load an image
* @async
*
* Races the url image load against a timer to check if the image can be loaded.
* The function does this by creating an Image object an success/error handlers
*
*@param {string} url
* the given url that will be checked
*
*@return a promise that resolves to the value of a successful url
*/
function testImage(url) {

    var timedOut = false;
    var img = new Image();

    return new Promise(function(fulfill, reject) {

      img.onerror = img.onabort = () => {
          if (!timedOut) {
            console.log("load failed");
              clearTimeout(timer);
              reject("load failed");
          }
      };

      img.onload = function() {
          if (!timedOut) {
            console.log("loaded");
              clearTimeout(timer);
              fulfill(url);
          }
      };

      img.src = url;

      timer = setTimeout(function() {
          console.log("timedout");
          timedOut = true;
          // reset .src to invalid URL so it stops previous
          // loading, but doesn't trigger new load
          img.src = "//!!!!/test.jpg";
          reject("timeout");
      }, 5000);

    })
}

/**
* @function ensures that a valid image url is sent back to the router
* @async
*
* This function will first check if the string value is null. In the case that
* it is, it will fulfill the image with the default image url. Else, it uses
* the testImage function to make sure the url is valid, and either fulfills
* the promise with the user given or default image url.
*
*@param {string} image
* the value of the html image url input that will be checked
*
*@return a promise that resolves to the value of the url that will be used
*/
function fillImage(image) {
  console.log("fillImage is being invoked")
  return new Promise(function(fulfill, reject) {
    if (!image){
      image = "/images/brain.jpg";
      console.log("image has been filled")
      // Need to find default image
      fulfill(image);
    }
    else {

      let test = testImage(image);
      test.then( url => {
        console.log("success");
        fulfill(url);
      },
      err => {
        console.log("failure, because of:" + err);
        // image = "/images/brain.jpg";
        fulfill("/images/brain.jpg");
      });
    }
  })
}

/** @global */
let imageHasBeenChecked = false;

/**
* @event
* Intercepts the form submits and checks the validity of the image's url
*/

$("form").submit(function(e){
  if (!imageHasBeenChecked) {
    e.preventDefault();

    let imageInputElement = $('input[name="image"]')[0];
    let userProvidedImage = imageInputElement.value;

    fillImage(userProvidedImage)
    .then((returnedImage)=> {

      // let postInformation = extractFormInformation();
      console.log("Image filled in by check: " + returnedImage);
      imageInputElement.value = returnedImage;

      console.log("Ajax request is about to be sent");
      imageHasBeenChecked = true;
      $(this).submit();
    },
    err=> {
      console.log(err);
    });
  }
});
