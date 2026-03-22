
// This is what starts a connection (SESSION) between your 'app' and 'MongoDB'.
// You run it with 'node index.js'   

// Imports 'mongoose' assuming already installed
//require('dotenv').config();  // REMOVED!!!! as dotenv already being called in 'server.js' when project broken up into separate files.
                            // It loads '.env' file, so 'process.env.MONGODB_URI' is available
                            // it is your MongoDB connection string.
const mongoose = require('mongoose'); //Imports 'Mongoose' in to the file for use

    //async function main() {
   async function connectDB() {
  //await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGO_URI);  // opens connection session through which the app file can starts CRUD stuff on the MongoDb.
  console.log('Connected to MongoDB via Mongoose!'); //consoles to the terminal if connection successfully.
}

/*
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
*/


module.exports = connectDB  // exports the file so that 'server.js' entry point file can use it