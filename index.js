const express = require('express')
const app = express()
const stripe = require("stripe")(`sk_test_51NEdRqLQLVWVnV1HZTftjIeUs0Q8a4RjIJHxQRAZ2wlBnVXvIMZI0IqBGsJHAh7nXrqB9N6MRDcxYMbE0M2j40OB00NGWWEYTq`);


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.port || 6889
var cors = require('cors')
require('dotenv').config()
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PATCH,PUT,DELETE",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  })
);
app.use(express.json());
var jwt = require('jsonwebtoken');
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ioy1chb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection


    const database = client.db("assignment-12");
    const movies = database.collection("classes");
    const movies2 = database.collection("Instructor");
    const user = database.collection("UserCollection2");
const AddClassdata=database.collection("AddClassData");
const cartCollectiion=database.collection("Cart");
const enrollClass=database.collection("enrollClass");
//verify jwt token
const verifyjwt=(req,res,next)=>{
  const authorization=req.headers.authorization;
  console.log("authorization",authorization);
  if(!authorization){
return res.status(401).send({error:true,message:"unauthorized user"})
  };
  const token=req?.headers?.authorization.split(" ")[1];
  console.log("token",token);
  jwt.verify(token, process.env.GENERATE_KEY, function(err, decoded) {
   
      if(err){
        
          return res.status(403).send({error:true,message:"no valid user"})

      }
     req.decoded=decoded;
      next();
    });
 } 
 //verify jwt token
 app.post('/jwt',async(req,res)=>{
  const data=req.body;
  var token = jwt.sign(data, process.env.GENERATE_KEY, { expiresIn: '10h' });
  console.log("mytoken",token);
  res.send({token});
  
     })
//Admin
app.post('/users',async(req,res)=>{
  const data=req.body;
  const email=data.email;
  const query={email:email};
  const avoiddata=await user.findOne(query);
  if(avoiddata){
 return   res.send({message:"user already exists"});
  }
  const result=await user.insertOne(data);
  res.send(result);
  console.log(result);

})
//Admin
app.patch('/updateinstructor/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const updateDoc = {

    $set: {

     
      
      role2:"Instructor"

    },

  };

const result=await user.updateOne(query,updateDoc);
console.log(result);
res.send(result);
})
//Admin
app.patch('/updateinstructor2/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const updateDoc = {

    $set: {

      role2:"Admin",
      
     

    },

  };

const result=await user.updateOne(query,updateDoc);
console.log(result);
res.send(result);
})


//Instructor Send Add_Class Data
app.post('/AddClass',async(req,res)=>{
  const data=req.body;
  const result=await AddClassdata.insertOne(data);
  console.log(result);
  res.send(result);
})

//update_pending_to_approved
app.patch('/Status_Approve/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const updateDoc = {

    $set: {

      
status:"Approved",
      
     

    },

  };

const result=await AddClassdata.updateOne(query,updateDoc);
console.log(result);
res.send(result);


})
//update_pending_to_denied
app.put('/Status_Denied/:id',async(req,res)=>{
  const data=req.body;
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const options = { upsert: true };
  const updateDoc = {

    $set: {

      
      ...data,status:"Deny",

      
     

    },

  };

const result=await AddClassdata.updateOne(query,updateDoc,options);
console.log(result);
res.send(result);


})
//Instructor Get AddClass Data by id
app.get('/getAddClassbyId/:id',async(req,res)=>{
const id=req.params.id;
const query={_id:new ObjectId(id)};
const result=await AddClassdata.findOne(query)
res.send(result);

})
//Updated AddClassData ----Instructor
app.patch('/Update_AddClassItem/:id',async(req,res)=>{
const id=req.params.id;
  const data=req.body;
  const query={_id:new ObjectId(id)};
  const updateDoc = {

    $set: {

      
      ...data

      
     

    },

  };
  const result=await AddClassdata.updateOne(query,updateDoc);
console.log(result);
res.send(result);
  
})
//AddCart data for user
app.post('/CartCollection',async(req,res)=>{
  const data=req.body;
  const id=data.class_id;
  const email=data.instructor_email;
  const userid=data.instructor_id;

  // const getclassid=await cartCollectiion.findOne({});
  const emailget=await cartCollectiion.findOne({class_id:id,instructor_email:email}); 
  // const useridget=await cartCollectiion.findOne({instructor_id:userid});
  if(emailget){
    return   res.send({message:" already enrolled"});
  }
  
  const result=await cartCollectiion.insertOne(data);
  res.send(result);
})

// app.post("/createpayment",async (req, res) => {
//   console.log("Hellow payment");
//   const price= req.body;
//   const amount= price * 100;
// console.log("amount",price);
 
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: amount,
//     currency: "usd",
//     payment_method_types: ["card"],
//   });
// console.log("PAYMENT",paymentIntent);
//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });

app.post("/create-payment-intent", async (req, res) => {
  const {price}= req.body;
  const amount= parseInt(price * 100);
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


//enrollclass
app.post('/enrollClass',async(req,res)=>{
  const data=req.body;
  const result=await enrollClass.insertOne(data);
  res.send(result);
})
app.get('/enrollemail',async(req,res)=>{
  const email=req.query.email;
  const result=await enrollClass.find({instructor_email:email}).toArray();
  res.send(result);
})
app.get('/enrollemail2',async(req,res)=>{
  const email=req.query.email;
  const result=await enrollClass.find({instructor_email:email}).sort({date: -1 }).toArray();
  res.send(result);
})
// app.patch('/cartseatUpdate/:id',async(req,res)=>{
//   const id=req.params.id;
//   const data=req.body;
//   const query={_id:new ObjectId(id)};
 
//   const result=await cartCollectiion.updateOne(query,updateDoc);
// console.log(result);
// res.send(result);

// })
app.delete('/cartdatadel/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const result=await cartCollectiion.deleteOne(query);
  res.send(result);
})
app.get('/Cartdata',async(req,res)=>{
  const email=req.query.email;
  const result=await cartCollectiion.find({
    instructor_email:email}).toArray();
  res.send(result);
})
app.get('/Cartdata/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const result=await cartCollectiion.findOne(query);
  res.send(result);
})
app.patch('/UpdateAddClassdataseat/:id',async(req,res)=>{
const id=req.params.id;
  const data=req.body;
  const query={_id:new ObjectId(id)};
  const updateDoc = {

    $set: {

      
      ...data

      
     

    },

  };
  const result=await AddClassdata.updateOne(query,updateDoc);
console.log(result);
res.send(result);
})
//update totalenroll

app.put('/updateaddclassdataenroll/:id',async(req,res)=>{
  const id=req.params.id;
  const data=req.body;
  const query={_id:new ObjectId(id)};
  const updateDoc = {

    $set: {

      
      ...data

      
     

    },

  };
  const result=await AddClassdata.updateOne(query,updateDoc);
console.log(result);
res.send(result);


})
//Instructor Get AddClassData   by his email
app.get('/getAddClassData',async(req,res)=>{
  const email=req.query.email;
  const result=await AddClassdata.find({Instructor_Email:email}).toArray();
  res.send(result);
})
//Admin Get All AddClassData
app.get('/getAddClassDataAll',async(req,res)=>{
  const result=await AddClassdata.find().toArray();
  res.send(result);
})
//We Get AddClassData As Approved Status
app.get('/getApprovedClass',async(req,res)=>{
  const result=await AddClassdata.find({status:"Approved"}).toArray();
  res.send(result);
})
//getapproveclassdatabyid
app.get('/getApprovedClass/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const result=await AddClassdata.findOne(query)
  res.send(result);
})
//Student wise Navbar

app.get('/Studentwise/:email',async(req,res)=>{
  const email=req.params.email;
  console.log(email);
  const query={email:email};
  const data=await user.findOne(query);
  console.log("getdataStudent",data);
  if(data?.role2==="Student"){
    const admin={Student:data?.role2==="Student"};
    console.log(admin);
    res.send(admin);
  }
})


//Instructor wise Navbar
app.get('/Instructorwise/:email',async(req,res)=>{
  const email=req.params.email;
  console.log(email);
  const query={email:email};
  const data=await user.findOne(query);
  console.log("getdataInstructor",data);
  if(data?.role2==="Instructor"){
    const admin={Instructor:data?.role2==="Instructor"};
    console.log(admin);
    res.send(admin);
  }
})

//Admin wise Navbar

app.get('/Adminwise/:email',async(req,res)=>{
  const email=req.params.email;
  console.log(email);
  const query={email:email};
  const data=await user.findOne(query);
  console.log("getdataAdmin",data);
  if(data?.role2==="Admin"){
    const admin={Admin:data?.role2==="Admin"};
    console.log(admin);
    res.send(admin);
  }})










//After Signup

app.get('/signup_users',async(req,res)=>{
  const data=await user.find().toArray();
  res.send(data);
})
//get data by emailwise from userCollection
app.get('/signup_usersbyemail',async(req,res)=>{
  const data=req.query.email;
  const result=await user.findOne({email:data});
  res.send(result);
})
//All Approved Classes Collection
app.get('/classes_name',async(req,res)=>{
    const result=await movies.find().toArray();
    res.send(result);
})
//All Instructor Classes Collection
app.get('/instructors',async(req,res)=>{
  const{page,limit}=req.query;
  const pageInt=parseInt(page);
  const limitInt=parseInt(limit);

  
    const result=await movies2.find().skip((pageInt-1)*limitInt).limit(limitInt).toArray();
    res.send(result);
})
app.get('/instructors2',async(req,res)=>{
  const result=await movies2.find().toArray();
  res.send(result);
})
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })