$( document ).ready(function() {
  console.log( "ready!" );

  // SHOW/HIDE LOGIN FORM
  $("#nav-anchor").click(() => {
    if ($("#form").css("display") === 'block') {
      $("#form").slideUp("slow", function () {
        // Animation complete.
      });
    } else {
      $("#form").slideDown("slow", function () {
        // Animation complete.
      });
    }
  });



}); // document ready