// CALLED ON views>index.ejs and document on ready queries the db and iterates through the object

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/app"
  }).done((quizzes) => {
    console.log(quizzes)
    for(quiz of quizzes) {

      $("<div>").text(quiz.name).appendTo($("#body-container"));
      // $("<div>").append("<img src=" + quiz.image_url + " />").append("<h2>" + quiz.name + "</h2>")
    }
    
  });
});
