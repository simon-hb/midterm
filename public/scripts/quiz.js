// CALLED ON views>index.ejs and document on ready queries the db and iterates through the object
$(() => {

 

  $("#submitQuiz").submit(function (event) {
    event.preventDefault();
    
    const iterate = $("#submitQuiz input:checked");
    const data_array = new Array();
    iterate.each(function(){
        
        const item = {};
        item['quizId'] = $(this).data('quizid');
        item['questionId'] = $(this).data('questionid');
        item['userId'] = $(this).data('userid');
        item['optionId'] = $(this).data('optionid') ;

        data_array.push(item);

    });
    const pageURL = window.location.pathname;
    console.log(pageURL)
    // to make post request to /quiz/:url
    
    $.ajax({
      type: "POST",
      url: pageURL,
      data: {userSubmission: data_array}
    }).then((data) => {
      // need to show the data for result here
    })
      .fail(function(error) {
        console.log( "error", error );
      })




  }) // on click

}); // document ready



//const escape =  function(str) {
//   let div = document.createElement('div');
//   div.appendChild(document.createTextNode(str));
//   return div.innerHTML;
// };

/* <p>${escape(tweet.content.text)}</p> */
