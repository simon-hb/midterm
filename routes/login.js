/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

// checks to see if user exists and returns the user object if found or falsy value
const findUser = (emailID, users) => {
  for (const userID in users) {
    const encodedEmail = htmlEncode(users[userID].email);
    if ( encodedEmail === emailID) {
      return users[userID];
    }
  }
  return false;
}


// validates user's email and password combination and return truthy/falsy
const validatePassword = (userObj, email, passwordToCheck) => {
  console.log("UTC:", userObj);
  console.log("PWTC:", passwordToCheck);
  console.log("ETC:", email);
  const encodedUserEmail = htmlEncode(userObj.email);
  if ( encodedUserEmail === email && passwordToCheck === userObj.password) {
    return true;
  }
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


module.exports = (db) => {
  router.post("/", (req, res) => {
    console.log("inside login route:",req.body);
    
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        const checkUser = findUser(req.body.email, users);
        const emailPasswordCheck = validatePassword(checkUser, req.body.email, req.body.password);
        
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
    });

  return router;
};

function htmlEncode(str) {
  return String(str).replace(/[^\w. ]/gi, function (c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}