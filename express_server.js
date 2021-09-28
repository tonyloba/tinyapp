const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


// set the view engine to ejs
app.set("view engine", "ejs");

// Index page:

const urlDatabase = {
   "b2xVn2": {longURL: "http://www.lighthouselabs.ca"},
   "9sm5xK": {longURL: "http://www.google.com"},
   "bnun15": {longURL: "http://www.tweeter.com"}
};

//Create page to make new URLs:

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};
  res.render("urls_show", templateVars);
});

// endpoint "/u/:shortURL" will redirect to its longURL
app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
  
});


///Home page render
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


// Delete URL pages :
app.post("/urls/:shortURL/delete", (req, res) => {

  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")

})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




// generator : 6 symbol's string :
const generateRandomString = function() {
  const str = Math.random().toString(36).substring(2,8);
  return str;
}





// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


