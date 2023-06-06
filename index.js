const express = require('express')
const app = express()
const port = process.env.port || 6889
var cors = require('cors')
require('dotenv').config()
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })