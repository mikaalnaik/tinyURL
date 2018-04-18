const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//home page-ish
app.get("/", (req, res) => {
  res.end("Hello!");
});

//input urls to be shortened
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
  console.log(res)
});

//add new shortened url to the urlDatabase object
app.post("/urls", (req, res) => {
  console.log(req.body);
  urlDatabase[generateRandomNumber()] = req.body.longURL  // debug statement to see POST parameters
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
  // console.log(templateVars)
});

//TO FIX!
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//delete shortlink and longurl from server
app.post("/urls/:id/delete", (req, res) =>{
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
});

//update longurl with existing shortURL
app.post("/urls/:id", (req, res) =>{
   urlDatabase[req.params.id] = req.body.update
  res.redirect("/urls")
});


// identify url after the backslash
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
  // console.log(req.params.id)
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

//list out urlDatabase in JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




function generateRandomNumber(){
  let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','y','x','z']
  let randomNumber = ''

for (var i = 0; i < 7; i++){
  if(i % 2 === 0){
    var randomAlpha = alphabet[ Math.round(Math.random()*25) ]
    randomNumber += randomAlpha.toString();
  } else {
    randomNumber += Math.round(Math.random()*9)
  }
}
return randomNumber;
}
