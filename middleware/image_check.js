
// source for orginal code
// https://stackoverflow.com/questions/9714525/javascript-image-url-verify
function testImage(url) {
    console.log("testImage is being invoked")
    var timedOut = false;
    var img = new Image();

    return new Promise(function(reject, fulfill) {

      img.onerror = img.onabort = () => {
          if (!timedOut) {
              clearTimeout(timer);
              reject("load failed");
          }
      };

      img.onload = function() {
          if (!timedOut) {
              clearTimeout(timer);
              fulfill(url);
          }
      };

      img.src = url;

      timer = setTimeout(function() {
          timedOut = true;
          // reset .src to invalid URL so it stops previous
          // loading, but doesn't trigger new load
          img.src = "//!!!!/test.jpg";
          reject("timeout");
      }, 5000);

    })
}

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
        fulfill(image);
      },
      err => {
        image = "/images/brain.jpg";
        fulfill(image);
      });
    }
  })


}

module.exports = {fillImage:fillImage};
