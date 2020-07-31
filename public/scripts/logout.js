$( document ).ready(function() {

  $('#logout-button').click( function(event) {
    console.log("trying to logour")
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "/logout"
    }).then(() => {
      location.reload();
    })
      .fail(function(error) {
        console.log( "error", error );
      })
    
  }); 

}); // document ready
