// Fetching
const inputSlider=document.querySelector("[data-lengthSlider]");  // it is custom attribute we can also fetch by using id or class name

const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");

const copyBtn=document.querySelector("[data-Copy]");

const copyMsg=document.querySelector("[data-copyMsg]");

const uppercaseCheck=document.querySelector("#uppercase");

const lowercaseCheck = document.querySelector("#lowercase");

const numbersCheck = document.querySelector("#numbers");

const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generateButton");

const resetBtn=document.querySelector(".resetButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]"); // all checkbox will come in this variable

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';//string of symbols


// Editing-coding
// intialising value
let password="";
passwordLength=10;
passreset=10;
let checkCount=0;
handleSlider()// it reflect the password length on UI
// set strength circle color to grey
 setIndicator("#ccc");

//set passwdlength

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
     const min=inputSlider.min;
     const max= inputSlider.max;
     inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRndInteger(min,max){
     return Math.floor(Math.random()*(max-min))+min;   // random number between min and max

}


function generateRandomNumber(){
    return getRndInteger(0,9);
}


function generateLowerCase(){
       return String.fromCharCode(getRndInteger(97,123));
}



function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91)); 
}



function generateSymbol(){
      const random=getRndInteger(0,symbols.length);
      return symbols.charAt(random); // charAt return the character present at that place.
}




function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    }
     else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } 
    else {
      setIndicator("#f00");
    }
}


async function copyContent(){
   try{

    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="copied";
   }
   
catch(e){
     copyMsg.innerText="failed"   
}
// to make span of copy visible;
copyMsg.classList.add("active");
// kuch time me copied wale text ko invisible krna he
setTimeout(()=>{
   copyMsg.classList.remove("active");
},2000) ;// hide after 2 second
  
}

// shuffle password
function shufflepassword(Array){
   // using Fisher yates method
   for (let i = Array.length - 1; i > 0; i--) {
    // random j ,findout  using random function
    const j = Math.floor(Math.random() * (i + 1));
    // swap random j index and i
    const temp = Array[i];
    Array[i] = Array[j];
    Array[j] = temp;
  }
  let str = "";
  Array.forEach((el) => (str += el));
  return str;

}


// to know how many boxes are checked
function handleCheckBoxChange(){
     checkCount=0;
     allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
           checkCount++;
     });
   // special condition
   if(passwordLength<checkCount)
   {
    passwordLength=checkCount;
    handleSlider();
   }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})


inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent(); // aif there is any value in password display then only we can copy
})



generateBtn.addEventListener('click',()=>{
    // none of the checkboc are selected
    if(checkCount==0)return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // lets start the journey to find new pass
    // remove old passwd;
     password="";

    // lets put the stuff mentioned by checkboxes
 
    let funcArr=[];  // array of functions

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);   
    } 
     
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }  
    
    if(symbolsCheck.checked)
    {
        funcArr.push(generateSymbol);
    }
    

    // compulsory addition  (jo tick hue he)

    for(let i=0;i<funcArr.length;i++)
    {
        password+=funcArr[i]();
    }


//remaining

for(let i=0;i<passwordLength-funcArr.length;i++){
    let randIndex = getRndInteger(0,funcArr.length);
    password+=funcArr[randIndex]();
    // random koi bhi functio choose kr liya
}

// shuffle the password

password=shufflepassword(Array.from(password));//password is passed in the form of array 

// show in UI

passwordDisplay.value=password;

calcStrength();

});



// reset button



resetBtn.addEventListener('click',()=>{
         passwordLength = passreset;

        handleSlider();
    

    // lets start the journey to find new pass
    // remove old passwd;
     password="";

   
// show in UI

for (var i = 0; i < allCheckBox.length; i++) {
    allCheckBox[i].checked = false;
}

passwordDisplay.value=password;
setIndicator("#ccc");

});