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
      console.log("i'm back")
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