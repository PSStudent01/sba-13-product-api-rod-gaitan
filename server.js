
// My entry-point file

require('dotenv').config(); //this loads the  '.env' file at start up, so every file in the app has access to 'process.env' env variables
const express = require('express'); // loads Express to your app after having been installed
const connectDB = require('./config/connection');   // imports a database connection function 'connectDB' from file './config/connection.js.' aand giving it the same name 'connectDB'


const app = express(); // - 'express()' = function that comes from the Express library. 
                        // When you call it, it creates a complete 'Expressapplication object' and stores it in the variable 'app'.
                        // allowing 'app' to become sota like UI upon which you can adapt functions (.use, .get, .post, .listen, etc) that create the methods you use with your API
                        // without this line, 'app' would just be 'undefined'.

// Middleware
app.use(express.json()); // this middleware tells 'Express' to automatically parse incoming request bodies as JSON. 
                        // without this, when someone sends a POST request (to my API) with product data, 'req.body' would be 'undefined'.

// Connect to database
connectDB();  // Calls the function 'connectDB()' in 'connection.js' to establish a DB connection when the server starts.


const PORT = process.env.PORT || 5000;  // checks if there's a PORT variable defined in the .env file. IF there is one, it'll use it. ELSE, if there isn't one, it'll use default 5000.
app.listen(PORT, () => { // this starts the server and starts listening for incoming API requests on that port. 
                        // 'app' is defined in line 'const app = express();'.
console.log(`Server running on port ${PORT}`);  // The callback function THEN fires and executes the code that console logs a connection message, once the server is successfully up.
});
