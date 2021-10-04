const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

const bcrypt = require('bcrypt');

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'MyRandomCookieSession',
  keys: ['key1', 'key2']
}))

const {
  generateRandomString,
  findUserByEmail,
  urlsForUser,
  authenticateUser,
  emailMatchPass
} = require('./helpers')

// set the view engine to ejs
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "sdfsdf"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "s34r3f"
  },
  "bnun15": {
    longURL: "http://www.tweeter.com",
    userID: "wrg5df"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }

}


////////////// REGISTER  NEW user:

app.get("/register", (req, res) => {

  const userID = req.session["user_id"];
  const templateVars = {
    user: users[userID]
  };
  res.render("register", templateVars)
})

app.post("/register", (req, res) => {
  const email = req.body.email;

  if (!email || !req.body.password) {

    res.status(400).send("400 Email or Password is empty!");
    
  }
  else if (findUserByEmail(email, users)) {
    res.status(400).send("400 This email is already registered");
    
  } else {
    const password = bcrypt.hashSync(req.body.password, 10);
    const userID = generateRandomString();
    user = {
      id: userID,
      email,
      password
    };
    users[userID] = user;
    req.session["user_id"] = userID;
    res.redirect("/urls");
  }
});


app.get("/", (req, res) => {
  const userID = req.session["user_id"];
  if (userID) {
    res.redirect("/urls");
    return;
  }
  res.redirect("/login");
});

//////////////////  LOGIN :

app.get("/login", (req, res) => {
  const userID = req.session["user_id"];
  const templateVars = {
    user: users[userID]
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send("400 Email and password fields cannot be empty");
  }
  if (!findUserByEmail(email, users) || !emailMatchPass(email, password, users)) {
    res.status(403).send("403 Email or Password are incorrect");
    //if email exits & password is correct
  } else {
    const newId = authenticateUser(users, email, password);
    console.log(users, email, password);
    req.session["user_id"] = newId;

    res.redirect("/urls");
  }
});




//////////////// COOKIES :

// Logout :
app.post("/logout", (req, res) => {
  req.session = null
  res.redirect("/urls");
});


/////////////// NEW URL PAGES://///////////////

app.get("/urls/new", (req, res) => {
  const userID = req.session["user_id"];
  // check logic if not our user -> to urls
  if (!userID) {
    res.redirect("/login")
  } else {
    const templateVars = {
      user: users[userID],
      longURL: req.body.longURL,
      shortURL: req.body.shortURL
    };
    res.render("urls_new", templateVars);
  }
});


//////////HOME PAGE////////////////

app.get("/urls", (req, res) => {
  const userID = req.session["user_id"];
  // return URL specific for each userID using 'data' var:
  const data = urlsForUser(userID, urlDatabase);
  if (userID) {
    const user = users[userID];
    const templateVars = {
      urls: data, // urlDatabase-all view , or data -userID 
      user: users[userID]
    };
    res.render("urls_index", templateVars);
  } else {
    res.status(401).send("You must log in");
  }

});


// submit  with generated shortURL, adds it to urlDatabase  
//and redirects to "/urls/:shortURL"

app.post("/urls", (req, res) => {

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session["user_id"]
  };
  res.redirect(`/urls/${shortURL}`);
});


////////// NEW ShortURL pages ///////////////////

// Create page for newly created shortURL:
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session["user_id"];
  const userUrls = urlsForUser(userID, urlDatabase);
  const longURL = urlDatabase[req.params.shortURL].longURL
  const templateVars = {
    urlDatabase,
    userUrls,
    shortURL,
    longURL,
    user: users[userID]
  };
  if (!userID || !userUrls[shortURL]) {
    res.status(401).send("401 You are not authorised");
  } else {
    res.render('urls_show', templateVars);
  }

});

// check for /u:shortURL

app.get("/u/:shortURL", (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.shortURL;

  if (urlDatabase[req.params.shortURL]) {
    console.log(shortURL)
    console.log(urlDatabase[req.params.shortURL])
    const longURL = urlDatabase[req.params.shortURL]['longURL'];
    
    res.redirect(longURL);   
  } 
  else {
    res.status(404).send('This short URL does not exist');    
  }
  if (userID) {
    res.redirect("/urls");
    //return;
  }
  if (!userID) {
    res.status(403).send("403 This is not yours!!!");
    res.redirect("/login");
  }
});




//////// Delete URL pages :
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const userID = req.session["user_id"];
  if (!userID) {
    res.status(401).send("401 Must be logged in");
  }
  if (userID && userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];

    res.redirect("/urls");
  } else {
    res.status(403).send("403 You are not authorized");
  }

  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
})

/////// Update URL page:
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const userID = req.session["user_id"];
  if (!userID) {
    res.status(401).send("401 Must be logged in");
  }
  if (userID && userID === urlDatabase[shortURL].userID) {

    urlDatabase[shortURL] = {
      longURL: longURL,
      userID: userID
    };
    res.redirect("/urls");
  } else {
    res.status(403).send("403 You are not authorized");
  }

})




/////// SERVER //////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
