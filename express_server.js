const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


// set the view engine to ejs
app.set("view engine", "ejs");

// index page
const urlDatabase = {
   "b2xVn2": {longURL: "http://www.lighthouselabs.ca"},
   "9sm5xK": {longURL: "http://www.google.com"}
};

//Create page to make new URLs
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});



// Create page for created shortURL:
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};
  res.render("urls_show", templateVars);
});








app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




// generator 6 symbols string :
const generateRandomString = function() {
  const str = (Math.random()+1).toString(36).substring(7);
  return str;
}





// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


