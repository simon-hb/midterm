// CALLED ON views>index.ejs and document on ready queries the db and iterates through the object
$(() => {



  $("#submitQuiz").submit(function (event) {
    event.preventDefault();

    // NOTETOKAUSH: get userID and if not logged in, prompt login
    const iterate = $("#submitQuiz input:checked");
    const data_array = new Array();
    iterate.each(function () {

      const item = {};
      item['quizId'] = $(this).data('quizid');
      item['questionId'] = $(this).data('questionid');
      item['userId'] = $(this).data('userid');
      item['optionId'] = $(this).data('optionid');

      data_array.push(item);

    });
    const pageURL = window.location.pathname;
    console.log(pageURL)
    // to make post request to /quiz/:url

    $.ajax({
      type: "POST",
      url: pageURL,
      data: { userSubmission: data_array }
    }).then((data) => {
      console.log(data)
      let questionsAnswered = 0;
      let correctAnswers = 0;
      let totalQuestions = data.totalQ;
      for (answer of data.submissionResult) {
        const correctOption = answer.qo_id;
        $(`input[data-optionid='${correctOption}']`).parent().addClass('bg-success');
        questionsAnswered ++;

        if(answer.is_correct){
          correctAnswers ++;
        }
      }
      console.log($("#result-header"));
      $("#result-header").text(`You answered ${questionsAnswered} out of ${totalQuestions} and got ${correctAnswers} correct`)
    })
      .fail(function (error) {
        console.log("Post request to DB error", error);
      })

  }) // on take quiz form submit






}); // document ready



//const escape =  function(str) {
//   let div = document.createElement('div');
//   div.appendChild(document.createTextNode(str));
//   return div.innerHTML;
// };

/* <p>${escape(tweet.content.text)}</p> */


// SOMEHOW WORKS
// const parent = $(this).parent().get( 0 )
//         const grandparent = $(this).closest("#options-group").find("[data-optionid='823']").parent().addClass('bg-success');

//         // grandparent.find("[data-optionid='822']").addClass('bg-success')
//         console.log(grandparent)