

$( document ).ready(function() {
  console.log( "ready!" );

  // SHOW/HIDE LOGIN FORM
  $("#login-button").click(() => {
    console.log("Clicked")
    if ($("#login-form-div").css("display") === 'block') {
      $("#login-form").css("display", "none")
    } else {
      console.log("trying to unhide")
      $("#login-form-div").css("display", "block")
    }
  });



  $('#login-form').submit( function(event) {
    event.preventDefault();

    // console.log(this); // for form body
    // console.log(this.email.value); // value of email element in form - needs name parameter
    // console.log(this.email.value) // value of password element in form - needs name parameter

    const email = htmlEncode(this.email.value); // escapes malicious code
    const password = this.password.value; // escapes malicious code

    const userLoginData = {email,password};    
    $.ajax({
      type: "POST",
      url: "/login",
      data: userLoginData,
    })
      .then(function() {
        alert( "second success" );
      })
      .fail(function(error) {
        console.log( "error", error );
      })
    
  });





}); // document ready


function htmlEncode(str) {
  return String(str).replace(/[^\w. ]/gi, function (c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}