const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookies = require('cookie-parser');
const cookieSession = require('cookie-session')

app.use(express.static(__dirname + '/public'));
app.use(cookies());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["1280098"],
}))

const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // you will probably this from req.params
const hashedPassword = bcrypt.hashSync(password, 10);


var urlDatabase = {
  'b2xVn2' : {
    'url' : "http://www.lighthouselabs.ca",
    'createdBy' : "The Master"
  },
  '9sm5xK' : {
    'url' : "http://www.google.com",
    'createdBy' : "The Master"
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

//home page-ish
app.get("/", (req, res) => {
  res.end("Hello! Welcome to TinyURL");
});


//GET request for the register page
app.get("/register", (req, res) => {
  res.render("urls_register");
});


//GET input longUrls to be shortened
app.get("/urls/new", (req, res) => {

  if(users[req.session.user_id] == undefined){
    res.redirect('/login')
  } else {
    let templateVars = {
       user: users[req.session.user_id]
    }
    res.render("urls_new", templateVars);
  }
});


//add new user to user object and check for duplicate emails
app.post("/register", (req, res) => {
  var tempId = generateRandomNumber()


    for (var keys in users){
      if(users[keys].email == req.body.email){
        res.status(404).send({ error: '400 Error. You already have a login.'})
      } else if ((req.body.email) && (req.body.password)){
        users[tempId] = {
          id : tempId,
          email : req.body.email,
          password : bcrypt.hashSync(req.body.password, 10)
        }
      req.session.user_id = tempId
      res.redirect("/urls");
     } else {
      res.status(404).send({ error: '404 ERROR' });
    }
  }
});


//add new shortened url to the urlDatabase object
app.post("/urls", (req, res) => {
  // console.log(req.body);
  var tempUniqueNum = generateRandomNumber()
  urlDatabase[tempUniqueNum] = {
    url: req.body.longURL,
    createdBy: req.session.user_id
  }
console.log(req.session.user_id)
  console.log(urlDatabase) // debug statement to see POST parameters
  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});


//Redirect shortURLs to longURL website
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].url
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
  console.log('body', req.body)
    for (var keys in users){
      console.log('keys', keys)
      console.log('users', users)
      if(users[keys].email == req.body.email &&  bcrypt.compareSync(req.body.password, users[keys].password) ){
        req.session.user_id = users[keys].id
        res.redirect('urls')
      }
    }
    res.status(404).send({ error: '404 ERROR' });
});

app.get('/login', (req,res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render('urls_login', templateVars)
})

// identify url after the backslash
// rendering urls_show
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    user: users[req.session.user_id]
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

//generate random number for userID
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
