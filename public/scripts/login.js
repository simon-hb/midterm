$(document).ready(function () {

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
    event.preventDefault();
    const email = htmlEncode(this.email.value); // escapes malicious code
    const password = this.password.value; // escapes malicious code

    const userLoginData = { email, password };
    const ajaxReq = $.ajax({
      type: "POST",
      url: "/login",
      data: userLoginData,
    })
      .done(function (output, status) {
        const userValidatedHeader = ajaxReq.getResponseHeader('userValidated') === "true";
        const passwordValidatedHeader = ajaxReq.getResponseHeader('passwordValidated') === "true";
        
        console.log()

        if (userValidatedHeader && passwordValidatedHeader) {
          window.location = '/';

        } else if (!userValidatedHeader) {
          alert("WHO ARE YOU?!")
        } else if (!passwordValidatedHeader) {
          alert("GET YOUR STUFF TOGETHER!")
        }
      })
      .fail(function (error) {
        console.log("error", error);

      });

  }) // login form on submit



}); // document ready


function htmlEncode(str) {
  return String(str).replace(/[^\w. ]/gi, function (c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}
