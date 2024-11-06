const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const db = require('./db')
require('dotenv').config() //load all key-value pairs in .env file to proces.env object

const path = require('path');
// console.log(path)

const port = process.env.PORT

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())
app.use(cookieParser());

// Import the router files
const userRoutes = require('./routes/userRoutes');

// Use the routers
app.use('/user', userRoutes);


app.get('/',(req,res)=>{
  // __dirname is a special variable that holds the directory where the current script resides
  const filePath = path.join(__dirname,'../public', 'index.html');
  // console.log(filePath)
  
  // Send the HTML file as a response
  res.sendFile(filePath);
})


app.listen(port,()=>{
    console.log(`Server started at ${port}`)
})