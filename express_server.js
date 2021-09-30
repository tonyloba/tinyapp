const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const bcrypt = require('bcryptjs');

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'MyRandomCookieSession',
  keys: ['key1', 'key2']
}))


// set the view engine to ejs
app.set("view engine", "ejs");


const urlDatabase = {
   "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID:"sdfsdf"},
   "9sm5xK": {longURL: "http://www.google.com", userID:"s34r3f"},
   "bnun15": {longURL: "http://www.tweeter.com", userID: "wrg5df"}
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

app.get("/register",(req,res) => {

  const userID = req.cookies["user_id"];
  const templateVars = {
    user : users[userID]
  };
  res.render("register",templateVars)
})

app.post("/register",(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("400 Email and Password are empty!");
  } 
  if (findUserByEmail(email, users)) {
    res.status(400).send("400 This email is already registered");
  } else {
    const userId = generateRandomString();
    user = {
      id:userId, 
      email,
      password 
    };
    users[userId] = user;
    res.cookie("user_id",userId);
  }
  res.redirect("/urls");
});


//////////////////  LOGIN :

app.get("/login", (req, res) => {
  const userID = req.cookies["user_id"];  
  const templateVars = {
    user : users[userID]
  };
    res.render("login",templateVars);    
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("400 Email and password fields cannot be empty");
  }
  if (!findUserByEmail(email, users)) {
    res.status(403).send("403 Email or Password are incorrect");
    //if email exits & password is correct
  } 
    
  req.cookies["user_id"] = userID
    res.redirect("/urls");  
   
});

// check for /u:id

app.get("/u/:id", (req, res) => {
  const userID = req.cookies["user_id"];
  if (userID) {
    res.redirect("/urls");
    //return;
  } 
  if (!userID) {
    res.status(403).send("403 That id does not exist");
    res.redirect("/login");
  }
});
// 2gwdqh

//////////////// COOKIES :

// Logout :
app.post("/logout", (req, res) => {   
  res.clearCookie("user_id")   
     res.redirect("/urls");    
 });



/////////////// NEW URL PAGES://///////////////

app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];
  // check logic if not our user -> to urls
  if (!userID) {
    res.redirect("/login")
  } else {
    const templateVars = { 
      user: users[userID],
      longURL: req.body.longURL,
      shortURL: req.body.shortURL
    };
  res.render("urls_new",templateVars);
  }
});

// submit  with generated shortURL, adds it to urlDatabase  and redirects to "/urls/:shortURL"
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  //console.log(req.body);  // Log the POST request body to the console  
  urlDatabase[shortURL] = {
    longURL : req.body.longURL, 
    userID: req.cookies["user_id"]
  };
  res.redirect(`/urls/${shortURL}`);
});


////////// NEW ShortURL pages ///////////////////

// Create page for newly created shortURL:
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = { 
    shortURL: req.params.shortURL,longURL: urlDatabase[req.params.shortURL].longURL,user : users[userID] //
  };
  res.render("urls_show", templateVars);
});


//////// Delete URL pages :
app.post("/urls/:shortURL/delete", (req, res) => {

  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
})

/////// Update URL page:
app.post("/urls/:shortURL", (req,res) => {
// shortUrl remains (get from object keys)
const shortURL = req.params.shortURL;
//longURL is entered by user: retreive from the body key
const longURL = req.body.longURL;
 res.redirect("/urls");
})


// endpoint "/u/:shortURL" will redirect to its longURL
app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL].longURL;
   const templateVars = {
    user : users[userID]
  };
  res.redirect(longURL);
  res.render("urls_show", templateVars);

});


//////////HOME PAGE////////////////

app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  // return URL specific for each userID using 'data' var:
  const data = urlsForUser(userID, urlDatabase);

  //console.log('userID', userID)
  const user = users[userID];
  //console.log(user); 
  const templateVars = { 
    urls: urlDatabase,  // urlDatabase-all view , or data -userID 
    user : users[userID] };

  res.render("urls_index", templateVars);
});







app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




// HELPER FUNCTIONS://///////

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

//// check userID anr returns its specific URLs:
const urlsForUser = function(id, urlDatabase) {
  let urls = {}
  for (const key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      urls[key] = urlDatabase[key]
    }
  }
  return urls;
}




// const authenticateUser = (userDB, email, password) => {
// 	if (userDB[email]) {
// 		// if (userDB[email].password === password) {
// 		if (bcrypt.compareSync(password, userDB[email].password)) {
// 			// Email & password match
// 			return { user: userDB[email], error: null };
// 		}
// 		// Bad password
// 		return { user: null, error: "bad password" };
// 	}
// 	// Bad email
// 	return { user: null, error: "bad email" };

// const protectRoutes = (req, res, next) => {
// 	const email = req.session.email;
// 	const path = req.path;
// 	const allowedPaths = ["/", "/login"];

// 	if (allowedPaths.includes(path)) {
// 		return next();
// 	}
// 	if (!email) {
// 		return res.redirect("/");
// 	}

// 	next();
// };

// const protectRoutes2 = (req, res, next) => {
// 	const email = req.session.email;
// 	const path = req.path;
// 	const allowedPaths = ["/", "/login"];

// 	if (allowedPaths.includes(path)) {
// 		return next();
// 	}
// 	if (!email) {
// 		return res.redirect("/");
// 	}

// 	next();
// };
