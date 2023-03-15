module.exports.getDate = getDate;

function getDate() {
 
var today = new Date();

var Option = {weekday:"long", 
year :'numeric' ,
 month:'short' ,
 day:'numeric' , 
 hour:'2-digit',
 second:'2-digit',
 minute:'numeric'
};

var day = today.toLocaleDateString('en-US',Option);

return day
}

module.exports.getTime = getTime;

function getTime() {
 
var today = new Date();

var Option = {weekday:"long", 
// year :'numeric' ,
//  month:'short' ,
//  day:'numeric' , 
// hour:'2-digit',
// second:'2-digit',
// minute:'numeric'
};

let day = today.toLocaleDateString('en-US',Option);

 return day;
}

module.exports.message = "THis is for clint Namaste:)" ; 