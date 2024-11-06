const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL,{
  dbName:'shadi',
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected',()=>{
  console.log("Connected to mongodb");
})

db.on('error',(err)=>{
  console.error("Mongo error:",err);
})

db.on('disconnected',()=>{
  console.log("disconnected to mongodb");
})

 module.exports = {
    db
  }