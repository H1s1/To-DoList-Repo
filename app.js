const express = require("express");
 const bodyParser = require("body-parser");  //body-parser allows you to access req.body from within routes and use that data.
const { urlencoded } = require("express");
const mongoose = require('mongoose');// driver to integrate Node.js web-apps with MongoDB 
const { redirect } = require("express/lib/response");
const _ = require("lodash");
const res = require("express/lib/response");


const app = express();    //allows to set-up middleware(here post & get request is acting as a middleware) to respond to HTTP requests.

const moduleDay = require(__dirname + "/date.js"); //exports desired functions and datas from the other files 
                          // here functions of date.js file is getting exorted to app.js file
                          
                          var workItems = [];
                          
                          
                          
 app.use(express.urlencoded({extended:true})); //It parses the data coming from post request .                     
 app.use(express.static(__dirname )); // Used to serve static files such as images, CSS files, and JavaScript files.
 app.set('view engine', 'ejs');

// Mongoose or DataBase Section :- 


main().catch(err => console.log(err));

async function main(){

    // Establishing connection between DB and this webApp.
    mongoose.connect("mongodb+srv://Himanshu:Test1234@cluster0.y4nquy6.mongodb.net/todolistDB");
    
    //Schema or bluePrint of records in document
    const itemsSchema = new mongoose.Schema({
        Name: String
       //, items : []
    });

    //Model(An isnstance of model is called a document)
    const Item = mongoose.model("Item" , itemsSchema);

    //Default items in the list
    const Item1 = new Item ({
        Name:"do exercise"
    });
    const Item2 = new Item ({
        Name:"do learingng"
    });
    const Item3 = new Item ({
        Name:"eat goodFoods"
    });
 
    const defaultitmes = [ Item1 ,Item2 , Item3];

    const listSchema = {
        Name:String,
        items: [itemsSchema]
    }

    const List = mongoose.model("List", listSchema);
    
   const day = moduleDay.getTime();
   
//........... Get root route ...........
      app.get("/",function(req,res){
        
       Item.find({},function(err,foundItems) {
   
           if(foundItems.length === 0){
            Item.insertMany(defaultitmes , function(err){
               if(err){
                   console.log(err);
               }else{
                   console.log("successfully saved default items to DB.");
               }
               res.redirect("/");
            });
           }
           else
           { 
             res.render("list" , {listTitle : day , newListItems : foundItems });
           }
          });
       }); 
       
//.........Adding new items to the list or DB........     
            app.post('/',(req,res)=>{
                const itemName = req.body.newItem;//new item you inserted in new/old list
                const listName = req.body.list; // title of the new/old list
       
                 const item = new Item({
                    Name: itemName
                 });
                
       
                 if(listName === day){
                   item.save();
                   res.redirect("/");
                 }
                  else 
                 {
                  List.findOne({Name:listName},function(err, foundList){
                    console.log( "This is foundList.items :- " + foundList.items);
                    foundList.items.push(item);
                    foundList.save();
                    res.redirect("/" + listName);
                  });
                 }
            
            });
   
   //dynamic routing with the help of express.js
   app.get("/:coustomListName", function(req,res){
     const coustomListName = _.capitalize(req.params.coustomListName);
      console.log(coustomListName);
      if(coustomListName === "Favicon.ico") return;
      console.log(coustomListName + " line no. 131 ");


     List.findOne({Name:coustomListName} , function(err,foundList){
       if(!err)
       {
         if (!foundList){
           //...........Create a new list on DB........
           const list = new List({
             Name: coustomListName ,
             items : defaultitmes
           });
           list.save();
           console.log("HEy folk! I am here on line no.->92 ");
           res.render("/" + coustomListName );
         } 
         else{
           //..............Show up an existing list................
           res.render("list.ejs", {listTitle: foundList.Name , newListItems: foundList.items});
         }
       }
     });
    });

   
  //......... Delteing check elemets from DB......
    app.post('/delete',function(req,res){
      
     const checkedItemid = req.body.checkbox;
     const listName = req.body.listName;
     
     if (listName === day)
      {
       Item.findByIdAndRemove(checkedItemid,function(err){
         if(!err){console.log("deleted successfully !!!");}
         
         res.redirect('/');
       });
     }
     else{
      List.findOneAndUpdate({Name: listName},{$pull :{items: {_id : checkedItemid}}},(err,foundList)=>{
        if(!err){
          res.redirect("/"+ listName);
        }
      })
     }
    });

}

app.listen(80,function(){
    console.log("port started at local host 80");
}); 