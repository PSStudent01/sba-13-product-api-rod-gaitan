
// This is what starts a connection (SESSION) between your 'app' and 'MongoDB'.
// You run it with 'node index.js'   

//require('dotenv').config();  // REMOVED!!!! as dotenv already being called in 'server.js' when project broken up into separate files.
                            // It loads '.env' file, so 'process.env.MONGODB_URI' is available
                            // it is your MongoDB connection string.
const mongoose = require('mongoose'); //Imports 'Mongoose' in to the file for use

/* Works but offers no graceful error handling. Instead use code block below
    //async function main() {
   async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);  // opens connection session through which the app file can starts CRUD stuff on the MongoDb.
  console.log('Connected to MongoDB via Mongoose!'); //consoles to the terminal if connection successfully.
}
*/

const connectDB = async () => { //wrapping this in 'async' function because connecting to a database takes time. Allows me to use 'await'
    try{  // TRY the following code.....
        const connecting = await mongoose.connect(process.env.MONGO_URI) // This is the  actual connection call.
                                                                         // pulls the connection string from your .env file allowing me to connect with with my pwd WITHOUT exposing it 
                                                                        // - 'await' = pauses execution until the connection is made, before moving on.
        console.log(`MongoDb connected!: ${connecting.connection.host}`)  // IF code runs successfully, THEN console log success message and its Atlas cluster address ( ${connecting.connection.host}).
    } catch(e) {  // ELSE_IF anything else goes wrong like wrong password, no internet, bad URI, etc, THEN the catch block intercepts the error so the app doesn't just crash SILENTLY....
        //console.log(`Error connecting to MongoDB: ${e.message}`)
        console.error(`Error connecting to MongoDB: ${e.message}`) //RATHER it tells teh user what might be wrong.
        process.exit(1) // this is for when if MongoDB fails to connect, the server shuts down immediately with a clear error message
                        // wihtout this line, the server will still start and run, but when user hits any API endpoint, they'll get a confusing error.
    }
}

module.exports = connectDB  // exports the file/function so that 'server.js' entry point file can import, call, and use it.





///////////////////// Scrap book ///////////

/*
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
*/
