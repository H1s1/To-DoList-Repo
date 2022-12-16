const express = require("express");
 const bodyParser = require("body-parser");  //body-parser allows you to access req.body from within routes and use that data.
const { urlencoded } = require("express");
const mongoose = require('mongoose');// driver to integrate Node.js web-apps with MongoDB 
const { redirect } = require("express/lib/response");
const _ = require("lodash");

const app = express();    //allows to set-up middleware(here post & get request is acting as a middleware) to respond to HTTP requests.

const moduleDay = require(__dirname + "/date.js"); //exports desired functions and datas from the other files 
                          // here functions of date.js file is getting exorted to app.js file
                          //var items = [];
                          var workItems = [];
                          
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true})); //It parses the data coming from post request .

app.use(express.static(__dirname )); // Used to serve static files such as images, CSS files, and JavaScript files.

// Mongoose or DataBase Section :-


main().catch(err => console.log(err));

async function main(){

    // Establishing connection between DB and this webApp.
    mongoose.connect("mongodb://127.0.0.1/todolistDB");
    
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
    //inserting items in DB
   
    // Item.insertMany( , function(err){
    //      if(err){console.log(err);}
    //      else{console.log("Items added sucessfully");}
    //  }); 

    //saving single document in  DB
   // await Item1.save();

//    //reading datas of DB in console
//    Item.find(function(err,results) {
//     if(err){console.log(err);}
//     else{console.log(results);}
//    });  
   const day = moduleDay.getTime();

   app.get("/",function(req,res){
    
     
    Item.find({},function(err,foundItems) {

        if(foundItems.length === 0){
         Item.insertMany(defaultitmes , function(err){
            if(err){
                console.log(err);
            }else{
                console.log("successfully saved default items to DB.");
            }
            res.redirect("/" + coustomListName);
         });
        }
        else
        { 
          res.render("list" , {listTitle : day , newListItems : foundItems });
        }
       });
    }); 
    
   
    //dynamic routing with the help of express.js
    app.get("/:coustomListName", function(req,res){
      const coustomListName = _.capitalize(req.params.coustomListName);
         if(coustomListName === "Favicon.ico") return;
         console.log(coustomListName);

      List.findOne({Name:coustomListName} , function(err,foundList){
        if(!err)
        {
          if (!foundList){
            //create a new list
            const list = new List({
              Name: coustomListName ,
              items : defaultitmes
            });
            list.save();
            console.log("HEy HimaNshu!!!I am here ")
            res.render("/"+ coustomListName );
          } 
          else{
            //show up an existing list
            res.render("list.ejs", {listTitle: foundList.Name , newListItems: foundList.items});
           // console.log(foundList.Name + "now item is :-" + foundItems.items)
          }
        }
        
      });
      
      
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
      
    });
    // app.all('/:action', function(req, res){});  
    
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