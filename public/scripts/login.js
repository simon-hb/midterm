

$(document).ready(function () {
  console.log("ready!");
  
  $("#login-form-div").css("display", "none")

  // SHOW/HIDE LOGIN FORM
  const showHideLogin = () => {
    if ($("#login-form-div").css("display") === 'block') {
      $("#login-form-div").css("display", "none")
    } else {
      $("#login-form-div").css("display", "block")
    }
  }


  $("#login-button").click(() => {
    showHideLogin()
  });

  $('#login-form').submit(function (event) {
    console.log("submitting")
    event.preventDefault();

    // console.log(this); // for form body
    // console.log(this.email.value); // value of email element in form - needs name parameter
    // console.log(this.email.value) // value of password element in form - needs name parameter

    const email = htmlEncode(this.email.value); // escapes malicious code
    const password = this.password.value; // escapes malicious code

    const userLoginData = { email, password };
    var xhr = $.ajax({
      type: "POST",
      url: "/login",
      data: userLoginData,
    })
      .done(function (output, status) {
        // alert( "second success" );
        console.log(xhr.getResponseHeader("canRedirect"))
        console.log("submitted");

        if (xhr.getResponseHeader('canRedirect') === '1') {
          window.location = '/';
        }


      })
      .fail(function (error) {
        console.log("error", error);
      })

  });





}); // document ready


function htmlEncode(str) {
  return String(str).replace(/[^\w. ]/gi, function (c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}