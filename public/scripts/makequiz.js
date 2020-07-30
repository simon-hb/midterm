$(() => {
  let questionNumber = 2;
  let optionNumber = 5;

  $("#add-question").click(()=> {

    $("#questions").append(createQuestionElement())
  })
  






}); // document ready

function textAreaAdjust(o) {
  o.style.height = "1px";
  o.style.height = (25+o.scrollHeight)+"px";
}