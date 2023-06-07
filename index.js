const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');

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

app.get('/classes_name',async(req,res)=>{
    const result=await movies.find().toArray();
    res.send(result);
})

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