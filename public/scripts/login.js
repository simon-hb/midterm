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
