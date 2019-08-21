const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');


const app = express();
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/empDB");

const employeeform = mongoose.model("employeedetails",{
    name:String,
    desi:String,
    salary:String

});

app.get("/",(req,res)=>{
    res.render("home");
});

app.post("/",(req,res)=>{
    var employee = employeeform(req.body);
    var result = employee.save((error)=>{
        if(error){
            throw error;
        }else{
            console.log("user added");
        }
    });
});

app.get("/getdata",(req,res)=>{
    employeeform.find().exec((error,data)=>{
        console.log(data);
        res.send(data);
    });
});

app.get('/searchEmployee',(req,res)=>{
    res.render("findemp");
});

app.get("/searchEmp/:name",(req,res)=>{
    var x= req.params.name;
    employeeform.find({name:x},(error,data)=>{
        if(error){
            throw error
        }else{
            res.send(data)
        }
    });
});



const api="http://localhost:3000/getdata";

app.get("/view",(req,res)=>{
    request(api,(error,response,body)=>{
        var data = JSON.parse(body);
        console.log(data);
        res.render("viewemployee",{data:data});
    });
    
});

const searchapi = "http://localhost:3000/searchEmp/";

app.post("/find",(req,res)=>{
    var x=req.body.name;
    console.log(x);
   
    request(searchapi+x,(error,response,body)=>{
        var mem = JSON.parse(body);
        res.render("viewemployee",{data:mem});
    })
})

app.get("/deleteEmp",(req,res)=>{
    res.render("deleteemp");
});

app.get("/delete/:name",(req,res)=>{
    var z = req.params.name;
    employeeform.deleteOne({name:z},(error)=>{
        if(error){
            console.log(error);
        }else{
            console.log("Sucessfully Deleted");
        }
    });
});


const del = "http://localhost:3000/delete/";

app.post("/delete",(req,res)=>{
    var y = req.body.name;
    request(del+y,(error,response,body)=>{

    });
});


app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is up and listening!");
});