$(() => {
  let optionNumber = 1;
  let questionNumber = 2;

  const createQuestionElement = () => {

    const questionElement = `
          <div class="card mb-3">
            <div class="card-body">
              <div>
                <input name="question${questionNumber}-title" class="form-control form-control-lg" type="text"
                  placeholder="Title for Question ${questionNumber}" >
              </div>
              <div>
                <input class="mt-3 form-control custom-success" type="text" name="question_${questionNumber}-option_${optionNumber}"
                  placeholder="Enter your correct answer here" >
                <input class="mt-3 form-control" type="text" name="question_${questionNumber}-option_${optionNumber+1}"
                  placeholder="Enter an incorrect answer here" >
                <input class="mt-3 form-control" type="text" name="question_${questionNumber}-option_${optionNumber+2}"
                  placeholder="Enter an incorrect answer here" >
                <input class="mt-3 form-control" type="text" name="question_${questionNumber}-option_${optionNumber+3}"
                  placeholder="Enter an incorrect answer here" >
              </div>

            </div>
          </div> 
    `;
    // const questionElement = `
    //       <div class="card mb-3">
    //         <div class="card-body">
    //           <div>
    //             <input name="question${questionNumber}-title" class="form-control form-control-lg" type="text"
    //               placeholder="Title for Question ${questionNumber}" required>
    //           </div>
    //           <div>
    //             <input class="mt-3 form-control custom-success" type="text" name="question_${questionNumber}-option_${optionNumber}"
    //               placeholder="Enter your correct answer here" required>
    //             <input class="mt-3 form-control" type="text" name="question_${questionNumber}-option_${optionNumber+1}"
    //               placeholder="Enter an incorrect answer here" required>
    //             <input class="mt-3 form-control" type="text" name="question_${questionNumber}-option_${questionNumber+2}"
    //               placeholder="Enter an incorrect answer here" required>
    //             <input class="mt-3 form-control" type="text" name="question_${questionNumber}-option_${questionNumber+3}"
    //               placeholder="Enter an incorrect answer here" required>
    //           </div>

    //         </div>
    //       </div> 
    // `;

    questionNumber += 1;
    return questionElement;

  }

  $("#add-question").click(() => {

    $("#questions").append(createQuestionElement())
  })


  $('#makequiz').submit((event) => {
    event.preventDefault();

    // NOTETOKAUSH: construct custom object to send to DB
    // data: {
        // details
        // questions: {
              // 1: {
                  // title: TITLE
                  // options: {}
              // }
        // }
    // }
    const queryString = $('#makequiz').serializeArray();

    const questionElems = $("[name ^=question]");
    console.log(questions)
    const questions = {};
    questionElems.each(function() {
      let i=0;

      temp.push($( this ).attr("name"));
      i++
    });

    console.log(temp)

    // $.ajax({
    //   type: "POST",
    //   url: "/quiz/new",
    //   data: queryString
    // }).then((data) => {
    //   // NOTETOKAUSH: notify user
    //   console.log("i'm back")
    // })
    //   .fail(function (error) {
    //     console.log("Post create quiz request to DB error", error);
    //   })

  })




}); // document ready

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};