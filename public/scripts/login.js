<<<<<<< HEAD
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

    // console.log(this); // for form body
    // console.log(this.email.value); // value of email element in form - needs name parameter
    // console.log(this.email.value) // value of password element in form - needs name parameter

    const email = htmlEncode(this.email.value); // escapes malicious code
    const password = this.password.value; // escapes malicious code

    const userLoginData = { email, password };
    const ajaxReq = $.ajax({
      type: "POST",
      url: "/login",
      data: userLoginData,
    })
      .done(function (output, status) {
        if (ajaxReq.getResponseHeader('userValidated') === "true") {
          window.location = '/';
        } else (
          alert("SERIOUSLY?! GET YOUR PASSWORD RIGHT!")
        )


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
=======
$(() => {
  $("#login").click(function () {
    $.ajax({
      method: "GET",
      url: "/api/users"
    }).done((users) => {
      console.log(users);
      for (user of users.users) {
        $("login").text(user.name).appendTo($("body"));
      }
    });
  })
});


$(document).ready(() => {
  $('#login').click(() => {
    $.ajax({
      method: "GET",
      url: "/login",
      data: {
        email: $("#email").val(),
        password: $("#password").val()
      },
      success: ((data) => {
        if (data === 'Correct') {
          $(".login-form").ejs;
        } else {
          alert("Error");
        }
      })
    })
  })
})
>>>>>>> 44271376733bc383268e1ab9119ec4651fd4da4f
