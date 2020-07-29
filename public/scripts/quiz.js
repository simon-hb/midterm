// CALLED ON views>index.ejs and document on ready queries the db and iterates through the object
$(() => {

  $("#submitQuiz").submit(function (event) {
    event.preventDefault();
    
    var iterate = $("#submitQuiz input:checked");
    var data_array = new Array();
    iterate.each(function(){
        
        const item = {};
        item['quizId'] = $(this).data('quizid');
        item['questionId'] = $(this).data('questionid');
        item['useId'] = $(this).data('userid');
        item['optioId'] = $(this).data('optionid') ;

        data_array.push(item);

    });
    
    console.log(data_array)


  }) // on click

}); // document ready



//const escape =  function(str) {
//   let div = document.createElement('div');
//   div.appendChild(document.createTextNode(str));
//   return div.innerHTML;
// };

/* <p>${escape(tweet.content.text)}</p> */
