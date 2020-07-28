$(document).ready(function () {
  $("#search-form-div").css("display", "none")

  // SHOW/HIDE LOGIN FORM
  $("#search-icon").click(() => {
    if ($("#search-form-div").css("display") === 'block') {
      $("#search-form-div").css("display", "none")
    } else {
      $("#search-form-div").css("display", "block")
    }
  });


  $('#search-form').submit(function (event) {
    event.preventDefault();
    
    const quizName = this.quizName.value;

    let subjectSelection = $("#subjectSelect option:selected").map(function () {
      return $(this).text();
    }).get();


    let levelSelection = $("#levelSelect option:selected").map(function () {
      return $(this).text();
    }).get();

    let toughnessSelection = $("#toughnessSelect option:selected").map(function () {
      return $(this).text();
    }).get();

    const queryObj = {quizName, subjectSelection, levelSelection, toughnessSelection }
    
    console.log(queryObj)

    $.ajax({
      type: "POST",
      url: "/search",
      data: queryObj
    }).then((data) => {
      console.log("post response recvd");
      console.log(data);
      $("#search-form-div").css("display", "none")
      $("#body-container").empty();

      for (quiz of data){
        $("#body-container").append("<div class='quiz'>").append("<img src=" + quiz.image_url + " />").append("<h2>" + quiz.name + "</h2>")
      }
    })
      .fail(function(error) {
        console.log( "error", error );
      })
  });

}); // document ready
