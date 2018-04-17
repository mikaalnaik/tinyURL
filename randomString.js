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
