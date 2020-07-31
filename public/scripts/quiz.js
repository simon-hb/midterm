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
      item['username'] = $(this).data('username');
      item['username'] = $(this).data('username');
      item['userId'] = $(this).data('userid');
      item['optionId'] = $(this).data('optionid');

      data_array.push(item);

    });
    const pageURL = window.location.pathname;
    // to make post request to /quiz/:url

    $.ajax({
      type: "POST",
      url: pageURL,
      data: { userSubmission: data_array }
    }).then((data) => {


      if (data.err) {
        $("#result-header").append("<h1 class='display-4'>Oops... something went wrong</h1>") // h5 sorry

        $("#result-header").append('<p class="lead">Unfortunately, we could not add your quiz to our database, try again and if the problem persists you can reach out to an admin with the following error code</p>') // paragraph text

        $("#result-header").append(`<p class="lead">${data.err.code}</p>`);
      } else {
        let questionsAnswered = 0;
        let correctAnswers = 0;
        let totalQuestions = data.totalQ;
        for (answer of data.submissionResult) {
          const correctOption = answer.qo_id;
          $(`input[data-optionid='${correctOption}']`).parent().addClass('bg-success');
          questionsAnswered++;

          if (answer.is_correct) {
            correctAnswers++;
          }
        }
        $("#result-header").append(`<p class='lead'>You answered ${questionsAnswered} out of ${totalQuestions} and got ${correctAnswers} correct</p>`)


        $("#result-header").append('<p >We have saved your result. <br> Click the buttons below to copy the link to your clipboard and visit the result to your submission. Share this with friends or take the quiz again!</p>') // paragraph text

        $("#result-header").append('<div class="row" id="share-buttons"></div>')


        $("#share-buttons").append('<button class="btn btn-flat-info my-1" id="copy-to-clipboard" type="button">Copy to Clipboard</button>')
        $("#share-buttons").append(`<a href="${data.testLink}"><button class="btn btn-success my-1" type="button">View Quiz</button></a>`)


        $("#copy-to-clipboard").click(() => {
          copyToClipboard(data.testLink);
        })

      }
    })
      .fail(function (error) {
        console.log("Post request to DB error", error);
      })

  }) // on take quiz form submit






}); // document ready

function copyToClipboard(text) {
  var input = document.body.appendChild(document.createElement("input"));
  input.value = text;
  input.focus();
  input.select();
  document.execCommand('copy');
  input.parentNode.removeChild(input);

  const button = document.getElementById('copy-to-clipboard')
  button.textContent = 'copied';
}
