const bodyParser = require("body-parser");  //body-parser allows you to access req.body from within routes and use that data.
const { urlencoded } = require("express");
const express = require("express");

const app = express();    //allows to set-up middleware(here post & get request is acting as a middleware) to respond to HTTP requests.

const moduleDay = require(__dirname + "/date.js"); //exports desired functions and datas from the other files 
                          // here functions of date.js file is getting exorted to app.js file
var items = [];
var workItems = [];

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true})); //It parses the data coming from post request .

app.use(express.static(__dirname )); // Used to serve static files such as images, CSS files, and JavaScript files.

app.get("/",function(req,res){
    
    let day = moduleDay.getTime();
     
    res.render("list", {listTitle: day , newListItems: items}); // Rendering is the process of gathering data (if any)
     //Then applying the gathered data to the associated templates(here our associated template is list.ejs) and then the final output is sent to the user. 
});                                                               

app.post('/',(req,res)=>{
    var item = req.body.newItem;
     //console.log(req.body);
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect('/work')
    }else{
        items.push(item);
        res.redirect('/');//The res. redirect() function lets you redirect the user to a different URL by sending an HTTP response with status 302. 
        //The HTTP client  will then "follow" the redirect and send an HTTP request to the new URL 
    }
  
});

app.get("/work",(req,res)=>{
      res.render('list', {listTitle: "Work List" , newListItems: workItems});
});

app.post("/work",function(req,res){
 let item = req.body.newItem;
 workItems.push(item);
 res.redirect("/work");
});

app.get("/about",function(req,res){
 res.render('about');
});

app.listen(3000,function(){
    console.log("port started at local host 3000");
});