// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'labber',
//   password: 'labber',
//   host: 'localhost',
//   database: 'midterm'
// });
// const queryString = `
// SELECT *
// FROM quizzes
// WHERE is_private = false;
// `;
// const queryParams = [];

// pool.query(queryString, queryParams)
// .then(res => {
//   const expectedResult = res.rows;
//   console.log(expectedResult);
//   pool.end();
// });

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

    const email = this.email.value;
    const password = this.password.value;

    const userLoginData = {email,password};
    console.log(userLoginData);

    
    $.ajax({
      type: "POST",
      url: "/login",
      data: userLoginData,
    })
      .done(function() {
        alert( "second success" );
      })
      .fail(function() {
        alert( "error" );
      })
    
  });





}); // document ready