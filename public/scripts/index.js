// USE IN HTML (when creating a quiz)
{/* <p>color of text will keep changing on each click</p>

<button onClick="getRandomColor()">Click on me</button> */}


function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
 $('.quizPic').css('color',color);
}
