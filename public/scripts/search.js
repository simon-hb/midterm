$(document).ready(function () {

  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };


  const makeQuizCard = (quizObject) => {

    const quizCardElement = `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch">
    <div class="card individual-card">
      <img class="card-img-top" src="${quizObject.image_url} alt="img for ${quizObject.name}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${escape(quizObject.name)}</h5>
        <p class="card-text">${escape(quizObject.desription)}</p>
        <a href="http://${document.location.host}/quiz/${quizObject.url}" class="btn btn-primary mt-auto">Take Quiz</a>
      </div>
    </div>
  </div>

    `;
    return quizCardElement;

  }
  
  $("#search-form-div").css("display", "none")

  // SHOW/HIDE LOGIN FORM
  $("#search-icon").click(() => {

    $("#login-form-div").css("display", "none");
    $("#register-form-div").css("display", "none");

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

      
      $("#quiz-cards").empty()


      for (quizObject of data){

        $("#quiz-cards").append(makeQuizCard(quizObject))
      }


    })
      .fail(function(error) {
        console.log( "error", error );
      })
  });

}); // document ready


