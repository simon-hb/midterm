

$( document ).ready(function() {
  console.log( "register ready!" );

  // SHOW/HIDE LOGIN FORM
  $("#register-button").click(() => {
    if ($("#register-form-div").css("display") === 'block') {
      $("#register-form-div").css("display", "none")
    } else {
      $("#register-form-div").css("display", "block")
    }
  });



  $('#register-form').submit( function(event) {
    event.preventDefault();

    // console.log(this); // for form body
    // console.log(this.email.value); // value of email element in form - needs name parameter
    // console.log(this.email.value) // value of password element in form - needs name parameter

    const username = this.username.value; // escapes malicious code
    const email = htmlEncode(this.email.value); // escapes malicious code
    const password = this.password.value; // escapes malicious code
    const name = this.name.value; // escapes malicious code
    
    const userLoginData = {name, username, email,password};
    
    $.ajax({
      type: "POST",
      url: "/register",
      data: userLoginData,
      success: function() {   
        location.reload(); 
      }
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