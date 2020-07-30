// CALLED ON views>index.ejs and document on ready queries the db and iterates through the object

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/app"
  }).done((quizzes) => {
    // for(quiz of quizzes) {

    //   const bodyContainer = $("#body-container");
    //   console.log("bodyCont setup")
      
    //   const containerDiv = bodyContainer.append("<div class='col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch'>")
      
    //   containerDiv.append("<div class='card individual-card'>");
    //   console.log("bodyCont appended child")
      
    //   card.appendChild("<img class='card-img-top' src='<%=quiz.image_url%>' alt='<%= quiz.name %>'></img>");
    //   console.log("bodyCont appended image")
      
    //   const cardBody = card.appendChild("<div class='card-body d-flex flex-column'>");
    //   console.log("bodyCont appended div")
    //   cardBody.appendChild("<h5 class='card-title'><%= quiz.name %></h5>");
    //   console.log("bodyCont appended h5")
    //   cardBody.appendChild("<p class='card-text'> <%= quiz.description %> </p>");
    //   console.log("bodyCont appended p")
    //   cardBody.appendChild("<a href='http://<%= host %>/quiz/<%= quiz.url %>' class='btn btn-primary mt-auto'>Take Quiz</a>");
    //   console.log("bodyCont appended a")

    // }
    
  });
});

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

/* <p>${escape(tweet.content.text)}</p> */
