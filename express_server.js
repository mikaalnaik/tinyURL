const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookies = require('cookie-parser');

app.use(cookies());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

//home page-ish
app.get("/", (req, res) => {
  res.end("Hello! Welcome to TinyURL");
});


//register
app.get("/register", (req, res) => {
  // let templateVars = {}
  res.render("urls_register");
});


//input urls to be shortened
app.get("/urls/new", (req, res) => {
  //where i'm passing in whole users object
  let templateVars = {
     user: users[req.cookies['user_id']]
  }
  res.render("urls_new", templateVars);

});


//add new user to user object and check for duplicate emails
app.post("/register", (req, res) => {
  var tempId = generateRandomNumber()

  var emailVerify = function(){
    for (var keys in users){
      if(users[keys].email == req.body.email){
        res.status(404).send({ error: '400 Error. You already have a login'})
      }
    }
}
  if (emailVerify(req.body.email) == true){
    res.status(404).send({ error: '404 ERROR' });
  } else if ((req.body.email) && (req.body.password)){
    users[tempId] = {
      id : tempId,
      email : req.body.email,
      password : req.body.password
    }
    res.cookie('user_id', tempId)
    console.log(users)
    res.redirect("/urls");
   } else {
    res.status(404).send({ error: '404 ERROR' });
}

});


//add new shortened url to the urlDatabase object
app.post("/urls", (req, res) => {
  // console.log(req.body);
  urlDatabase[generateRandomNumber()] = req.body.longURL;  // debug statement to see POST parameters
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls", (req, res) => {

  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']]
  };
  // console.log(templateVars)
  res.render("urls_index", templateVars);
});

//Redirect shortURLs to longURL website
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post('/logout',(req,res) => {
  res.clearCookie('user_id')
  res.render('urls_login')
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

//POST LOGIN
app.post("/login", (req, res) =>{
  var tempId = generateRandomNumber()

  var emailVerify = function(){
    for (var keys in users){
      if(users[keys].email == req.body.email && users[keys].password == req.body.password){
        res.cookie('user_id', users[keys].id)
        res.redirect('/urls')
      }
    }
}
  if (emailVerify(req.body.email) == true){
    res.status(404).send({ error: '404 ERROR' });
  } else if ((req.body.email) && (req.body.password)){
    users[tempId] = {
      id : tempId,
      email : req.body.email,
      password : req.body.password
    }
    res.cookie('user_id', tempId)
    console.log(users)
    res.redirect("/urls");
   } else {
    res.status(404).send({ error: '404 ERROR' });
}



   res.cookie('user_id', req.body.username)
   res.redirect("/urls")
});

app.get('/login', (req,res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']]
  };
  res.render('urls_login', templateVars)
})

// identify url after the backslash
// rendering urls_show
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    user: users[req.cookies['user_id']]
  };
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

//listen to server
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
