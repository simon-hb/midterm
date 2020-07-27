// CALLED ON views>index.ejs and document on ready queries the db and iterates through the object

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((quizzes) => {
    for(quiz of quizzes.quizzes) {
      $("<div>").text(quiz.name).appendTo($("body"));
      // console.log(quiz.name);
    }
  });
});
