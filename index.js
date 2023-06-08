const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.port || 6889
var cors = require('cors')
require('dotenv').config()
app.use(cors());
app.use(express.json());

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

//Admin
app.post('/users',async(req,res)=>{
  const data=req.body;
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

      role:"Admin",
      
     

    },

  };

const result=await user.updateOne(query,updateDoc);
console.log(result);
res.send(result);
})


//Instructor
app.post('/AddClass',async(req,res)=>{
  const data=req.body;
  const result=await AddClassdata.insertOne(data);
  console.log(result);
  res.send(result);
})



//Student wise Navbar

app.get('/Studentwise/:email',async(req,res)=>{
  const email=req.params.email;
  console.log(email);
  const query={email:email};
  const data=await user.findOne(query);
  console.log("getdata",data);
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
  console.log("getdata",data);
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
  console.log("getdata",data);
  if(data?.role==="Admin"){
    const admin={Admin:data?.role==="Admin"};
    console.log(admin);
    res.send(admin);
  }})










//After Signup

app.get('/signup_users',async(req,res)=>{
  const data=await user.find().toArray();
  res.send(data);
})
//All Approved Classes Collection
app.get('/classes_name',async(req,res)=>{
    const result=await movies.find().toArray();
    res.send(result);
})
//All Instructor Classes Collection
app.get('/instructors',async(req,res)=>{
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