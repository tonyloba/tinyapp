const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set("view engine", "ejs");

// index page
const urlDatabase = {
   "b2xVn2": {longURL: "http://www.lighthouselabs.ca"},
   "9sm5xK": {longURL: "http://www.google.com"}
};

// create page for new shortURL:

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};
  res.render("urls_show", templateVars);
});








app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});






// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// home page :
// app.get("/urls", (req, res) => {
//   const templateVars = { urls: urlDatabase };
//   res.render("urls_index", templateVars);
// });



// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


