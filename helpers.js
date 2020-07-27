const bcrypt = require("bcrypt");

// Helper Functions

// generates random 6 character alphanumeric strings; used for new url and new user
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
}

const generateFormattedDate = () => {
  const date = new Date();
  return (date.toISOString().split("T")[0]);
}


// checks to see if user exists and returns the user object if found or falsy value
const findUser = (emailID, users) => {
  for (const userID in users) {
    const encodedUserEmail = htmlEncode(users[userID].email)
    if ( encodedUserEmail === emailID) {
      return users[userID];
    }
  }
  return false;
}

const findUserByCookieID = (id, users) => {
  for (const user of users) {
    if (user.id === id) {
      return user;
    }
  }
  return false;
}

// registers new user is database when called
const registerNewUser = (email, password, users) => {
  const newUserID = generateRandomString();
  const id = newUserID;
  password = bcrypt.hashSync(password, 10);
  users[newUserID] = { id, email, password };
  return users[newUserID];
}

// validates user's email and password combination and return truthy/falsy
const validatePassword = (userObj, email, passwordToCheck) => {
  console.log(userObj);
  console.log(userObj.email);

  console.log(email);
  console.log("PWTC:", passwordToCheck);

  const encodedUserEmail = htmlEncode(userObj.email);


  if (encodedUserEmail === email && passwordToCheck === userObj.password) {
    console.log("got true")
    return true;
  }
  console.log("got false")
  return false;
}

// finds urls associated with a given userID
const findURLSByUser = (userCookieID, urlDatabase) => {
  let usersURLs = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userIDforLink === userCookieID) {
      usersURLs[url] = urlDatabase[url];
      usersURLs[url].longURL = urlDatabase[url].longURL
    }
  }
  return usersURLs;
}

function htmlEncode(str) {
  return String(str).replace(/[^\w. ]/gi, function (c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}

function htmlDecode(str) {
  return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
      var num = parseInt(numStr, 10); // read num as normal number
      return String.fromCharCode(num);
  });
}

module.exports = {
  findUser,
  findUserByCookieID,
  findURLSByUser,
  generateFormattedDate,
  generateRandomString,
  registerNewUser,
  validatePassword,
  htmlEncode,
  htmlDecode
}