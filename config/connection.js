
// I) and II) is what starts a connection (SESSION) between your 'app' and 'MongoDB'.
// You run it with 'node index.js'   

// I) Imports 'dotenv', 'mongoose' assuming already installed
require('dotenv').config();  // 1) It load '.env' file, so 'process.env.MONGODB_URI' is available
                            // it is your MongoDB connection string.
const mongoose = require('mongoose'); //Imports 'Mongoose' in to the file for use

async function main() {
  //await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGO_URI);  // opens connection session through which the app file can starts CRUD stuff on the MongoDb.
  console.log('✅ Connected to MongoDB via Mongoose!'); //con