// CALLED ON views>index.ejs and document on ready queries the db and iterates through the object

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users.users) {
      // $("<div>").text(user.name).appendTo($("body"));
      console.log(user);
    }
  });
});
