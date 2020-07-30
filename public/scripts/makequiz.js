// NOTETOKAUSH: add required tags
$(() => {
  let optionNumber = 1;
  let questionNumber = 2;

  const createQuestionElement = () => {

    const questionElement = `
      <div class="card mb-3">
      <div class="card-body" id="question-and-options">

        <div id="individual-question">
          <input class="form-control form-control-lg" type="text"
            placeholder="Title for Question ${questionNumber}" >
        </div>


        <div id="options">
          <input class="mt-3 form-control custom-success" type="text" placeholder="Enter your correct answer here" >
          <input class="mt-3 form-control" type="text" placeholder="Enter an incorrect answer here" >
          <input class="mt-3 form-control" type="text" placeholder="Enter an incorrect answer here" >
          <input class="mt-3 form-control" type="text" placeholder="Enter an incorrect answer here" >
        </div>
        </div>
      </div>
    `;

    questionNumber += 1;
    return questionElement;

  }

  $("#add-question").click(() => {

    $("#questions").append(createQuestionElement())
  })


  $('#makequiz').submit((event) => {
    event.preventDefault();
    const data = {}
    const basicFormData = {};

    const formdata = $("#makequiz").serializeArray();
    console.log(formdata)

    $(formdata).each(function (index, obj) {
      basicFormData[obj.name] = obj.value;
    });

    data.serialized = basicFormData;
    const questionElems = $("[id ^=question-and-options]");

    const questions = [];

    questionElems.each(function () {
      let i = 0;

      const ques = $(':nth-child(1)', this)
      const quesVal = $(':nth-child(1)', ques).val();

      const optsDiv = $(':nth-child(2)', this);
      const optsInputs = optsDiv.children();
      console.log(optsInputs);
      const optsVals = [];

      optsInputs.each((j, inp) => {
        optsVals.push($(inp).val())
      })
      const temp = {};
      temp.title = quesVal;
      temp.options = optsVals;

      questions.push(temp);

      i++
    });

    data.questions = questions;

    console.log(data)

    $.ajax({
      type: "POST",
      url: "/quiz/new",
      data: data
    }).then((response) => {
      // NOTETOKAUSH: notify user
      console.log(response);

      $("#jumbotron").empty();

      if (response.err){

        
        $("#jumbotron").append('<img src="https://i.giphy.com/media/l46CqxtAEdguUgC2I/200.webp" /> '); // image

        $("#jumbotron").append("<h1 class='display-4'>Oops... something went wrong</h1>") // h5 sorry

        $("#jumbotron").append('<p class="lead">Unfortunately, we could not add your quiz to our database, try again and if the problem persists you can reach out to an admin with the following error code</p>') // paragraph text

        $("#jumbotron").append(`<p class="lead">${response.err.code}</p>`);

        
      }else{
        
        $("#jumbotron").append('<img src="https://media.tenor.com/images/e643701b8766212d14f9c3b4bdb6e38c/tenor.gif" /> '); // image

        $("#jumbotron").append("<h1 class='display-4'>Congrats!</h1>") // h5

        $("#jumbotron").append('<p class="lead">We have added your quiz to our database. <br> Click the buttons below to copy the link to your clipboard and visit the quiz you just created. Have fun sharing the quiz with your friends and don\'t forget to ask them to send you a link to their results!</p>') // paragraph text

        $("#jumbotron").append('<div class="row" id="share-buttons"></div>')


        $("#share-buttons").append('<button class="btn btn-flat-info my-1" id="copy-to-clipboard" type="button">Copy to Clipboard</button>')
        $("#share-buttons").append(`<a href="${response.quizLink}"><button class="btn btn-success my-1" type="button">View Quiz</button></a>`)
        

        $("#copy-to-clipboard").click(()=> {
          copyToClipboard(response.quizLink);
        })
        
      }





    })
      .fail(function (error) {
        console.log("Post create quiz request to DB error", error);
      })

  })

  



}); // document ready

const escape = function (str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

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