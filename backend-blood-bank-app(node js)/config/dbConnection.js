const mongoose = require('mongoose');
const colors = require('colors');
const url = process.env.MONGODB_URL;

const dbConnection = async() =>{
  await mongoose.connect(url).then((con)=>{
    console.log(`Server connected ${con.connection.host}`.bgGreen.white);
  });
}

module.exports = dbConnection;