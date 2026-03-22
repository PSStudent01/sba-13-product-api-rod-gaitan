
/*
// III)  Defines the schema 
const userSchema = new mongoose.Schema({ //  defines exactly what fields a document can have, what types they must be, and what rules they must follow.
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  age:      { type: Number, min: 0, max: 120 },
  isActive: { type: Boolean, default: true },
  createdAt:{ type: Date, default: Date.now }
});

// IV) Compiles 'schema' into a 'model' to actually interact with your 'database'.
const User = mongoose.model('User', userSchema); //You need to compile it into a Model to actually interact with your database.
                                                  // - 'User' — the name of the model. Mongoose will automatically look for a collection called 'users' in MongoDB (lowercased + pluralized)
                                                  //- 'userSchema' — the shape/structure that documents in that collection should follow
*/

// Defining a schema called 'productSchema' 
const productSchema = new mongoose.Schema({  //  defines exactly what fields a document can have, what types they must be, and what rules they must follow.
    name:     	{ type: String, required: true },
    description:{ type: String, required: true },
    price:		{type: Number, required: true, $gt: 0},
    category: 	{ type: String, required: true},
    inStock: 	{ type: Boolean, defaults: true},
    tags: 		{},
    createdAt: 	{ type: Date, default: Date.now }
})

// Compiling the schema 'productSchema' into a model named 'Product' and exporting it.
const Product = mongoose.model('Product', productSchema);