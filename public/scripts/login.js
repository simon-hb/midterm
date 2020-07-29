$(document).ready(function () {
  $("#login-form-div").css("display", "none")

  // SHOW/HIDE LOGIN FORM
  $("#login-button").click(() => {

    $("#search-form-div").css("display", "none");
    $("#register-form-div").css("display", "none");

    if ($("#login-form-div").css("display") === 'block') {
      $("#login-form-div").css("display", "none")
    } else {
      $("#login-form-div").css("display", "block")
    }

  });

  $('#login-form').submit(function (event) {
    event.preventDefault();

    const email = this.email.value;
    const password = this.password.value;
    const userLoginData = { email, password };

    const ajaxReq = $.ajax({
      type: "POST",
      url: "/login",
      data: userLoginData,
    })
      .done(function (data) {
        const userValidated = data.userValidated;
        const passwordValidated = data.passwordValidated;

        if (userValidated && passwordValidated) {
          window.location = '/';
        } else if (!userValidated) {
          alert("WHO ARE YOU?!")
        } else if (!passwordValidated) {
          alert("GET YOUR STUFF TOGETHER!")
        }
      })
      .fail(function (error) {
        console.log("error", error);
      });
  }) // login form on submit

}); // document ready
