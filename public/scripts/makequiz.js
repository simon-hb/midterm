$(() => {
  let questionNumber = 2;
  let optionNumber = 1;

  const createQuestionElement = () => {

    const questionElement = `
          <div class="card mb-3">
            <div class="card-body">
              <div>
                <input name="question${questionNumber}-title" class="form-control form-control-lg" type="text"
                  placeholder="Title for Question ${questionNumber}" required>
              </div>
              <div>
                <input class="mt-3 form-control custom-success" type="text" name="question_${questionNumber}-option_${optionNumber}"
                  placeholder="Enter your correct answer here" required>
                <input class="mt-3 form-control" type="text" name="question_${questionNumber}-option_${optionNumber+1}"
                  placeholder="Enter an incorrect answer here" required>
                <input class="mt-3 form-control" type="text" name="question_${questionNumber}-option_${questionNumber+2}"
                  placeholder="Enter an incorrect answer here" required>
                <input class="mt-3 form-control" type="text" name="question_${questionNumber}-option_${questionNumber+3}"
                  placeholder="Enter an incorrect answer here" required>
              </div>

            </div>
          </div> 
    `;

    questionNumber += 1;
    optionNumber += 4
    return questionElement;

  }

  $("#add-question").click(() => {

    $("#questions").append(createQuestionElement())
  })


  $('#makequiz').submit((event) => {
    event.preventDefault()
    const queryString = $('#makequiz').serializeArray();

    console.log(queryString);
  })




}); // document ready

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};