const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


// set the view engine to ejs
app.set("view engine", "ejs");


const urlDatabase = {
   "b2xVn2": {longURL: "http://www.lighthouselabs.ca"},
   "9sm5xK": {longURL: "http://www.google.com"},
   "bnun15": {longURL: "http://www.tweeter.com"}
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


// Register NEW user:
app.get("/register",(req,res) => {
  const userID = req.cookies["user_id"];
  const templateVars = {
    user : req.cookies["user_id"]
  };
  res.render("register",templateVars)
})

app.post("/register",(req,res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (findUserByEmail(email, users)) {
    res.status(400).send("400 This email is already registered");
  } else {
    const userId = generateRandomString();
    newUserItem = {
      id:userId, 
      email,
      password 
    };
    users[userId] = newUserItem;
    req.cookies["user_id"]= userId;
  }
  res.redirect("/urls");
});




// Cookies :
app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];  
  const templateVars = {
    user : req.cookies["user_id"]
  };
    res.redirect("/urls");    
});

// Logout :
app.post("/logout", (req, res) => {   
  res.clearCookie("user_id")   
     res.redirect("/urls");    
 });



//Create page to make new URLs:

app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = {
    user : req.cookies["user_id"]
  };
  res.render("urls_new",templateVars);
});

// submit data POST with generated shortURL, adds it to urlDatabase  and redirects to "/urls/:shortURL"
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${shortURL}`);
});


//New ShortURL pages

// Create page for newly created shortURL:
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user : req.cookies["user_id"]};
  res.render("urls_show", templateVars);
});

// endpoint "/u/:shortURL" will redirect to its longURL
app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
  
});


///Home page render
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user : req.cookies["user_id"]};

  res.render("urls_index", templateVars);
});


// Delete URL pages :
app.post("/urls/:shortURL/delete", (req, res) => {

  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")

})


// Update URL page:
app.post("/urls/:shortURL", (req,res) => {
// shortUrl remains (get from object keys)
const shortURL = req.params.shortURL;
//longURL is entered by user: retreive from the body key
const longURL = req.body.longURL;

 res.redirect("/urls");
})





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




// HELPER FUNCTIONS:
const generateRandomString = function() {
  const str = Math.random().toString(36).substring(2,8);
  return str;
}

// check if email exists:
const findUserByEmail = (email, userDB) => {
  for (const user in userDB) {
    if (userDB[user].email === email) {
      return true;
    }
  }
  return false;
}



// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


