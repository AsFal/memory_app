var passwordVerification = $('input[name=passwordVerification]');
var password = $('input[name=password]');
$("button[type=submit]").prop('disabled', true);

 function refresh (html, position) {
   var element = $("form div:nth-of-type(" + position.toString() + ") span");
   // var parent = element.parent();
   element.remove();
   $("form div:nth-of-type(" + position.toString() + ") label").append(html);
 }


password.keyup(function(){
  if ($(this)[0].value.length < 8) {
    refresh('<span style="color:red;"> too short </span>', 2);
    $("button[type=submit]").prop('disabled', true);
  }
  else {
    refresh('<span></span>', 2)
    $("button[type=submit]").prop('disabled', false);
  }
});



passwordVerification.keyup(function(){
  if($(this)[0].value !== $('input[name=password]')[0].value) {
    refresh('<span style="color:red;"> do not match </span>', 3);
    $("button[type=submit]").prop('disabled', true);
  }
  else {
    refresh('<span style="color:green;"> match </span>', 3);
    $("button[type=submit]").prop('disabled', false);
  }
});

$("button[type=submit]").mutate
