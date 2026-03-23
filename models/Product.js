
const mongoose = require('mongoose'); // Imports 'mongoose' for the file to use

// Defining a schema called 'productSchema' 
const productSchema = new mongoose.Schema({  //  defines exactly what fields a document can have, what types they must be, and what rules they must follow.
    name:     	{ type: String, required: true },
    description:{ type: String, required: true },
    //price:		{type: Number, required: true, $gt: 0},    
    price:		{type: Number, required: true, min: [0.01, 'Price must be greater than 0']}, 
    category: 	{ type: String, required: true},
    inStock: 	{ type: Boolean, default: true},
    tags: 		{type: [String]},
    createdAt: 	{ type: Date, default: Date.now }
})

// Compiling the schema 'productSchema' into a model named 'Product' and exporting the model.
const Product = mongoose.model('Product', productSchema); // You need to compile it into a Model to actually interact with your database.
                                                          //-'Product' — the name of the model. Mongoose will automatically look for a collection called 'products' in MongoDB (lowercased + pluralized)
                                                          //- 'productSchema' — the shape/structure that documents in that collection should follow
module.exports = Product;  // exports the model