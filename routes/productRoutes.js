// Ia) Router setup:
const express = require('express'); // loads Express to your app after having been installed
const Product = require('../models/Product'); //'productSchema' having been converted from a schema into a model 'Product', now we import it, so that it can interact with DB
const router = express.Router();  // this creates a mini router object that holds all of the needed routes

// Route POST /api/products - to create a new product
router.post('/', async (req, res) => { // creates a POST route..
    try{                                 //...while gracefully handling errors....
        // const product = await Product.create(req.body)
        const product = new Product(req.body);  //...where IF it 'imports' the 'Product' model successfully...
        const savedProduct = await product.save(); //... THEN 1)it waits and 2)if the 'Product' model (savedProduct) is valid, 3)it saves data to DB...
        res.status(201).json(savedProduct); // ...and 4)returns a 201 code (201 = 'Created')- record successfully 'created'!
    } catch(err){ //...ELSE
          //res.status(400).json(err);
          res.status(400).json({ message: err.message}); //returns a 400 error code (400 = 'Bad Request')-  record creation 'failed'! 
                                                         // chose '(err)' & 'message: err.message' bc many thing scan go wrong here and hardcoding it wouldnt cover them all   

    }
})
/*
Testing parameters:
Method: POST
URL: http://localhost:5000/api/products
Body: raw > JSON
- tested both for both status codes:
-- 201
-- 400
- MongoDB correctly updated
*/


// Route GET /api/products/:id - to fetch a single product by ID
router.get('/:id', async (req, res) => { // creates a GET route...
    try{      //...while gracefully handling errors...
        const product = await Product.findById(req.params.id); //...where IF it 'finds' the 'Product' model successfully..
        if (!product) {                                         //...BUT the specific product is not valid/found..
            return res.status(404).json({ message: 'Product not found' }); //...it returns a 404 error code (404 = 'Product not found') 
        }
        res.status(200).json(product); //...ELSE IF product found, it returns a 200 code (200 = OK) - specific record successfully 'found'!!
    } catch{                         
        //res.status(400).json({ message: err.message });
        res.status(400).json({ message: 'Invalid ID format' })  //...ELSE returns a 400 error code (400 = 'Invalid ID format') 
    }
})
/*
Testing parameters:
Method: GET
Body: raw > JSON
#
Test 1 — Valid ID that exists:
GET http://localhost:5000/api/products/69c09ec02259995c462a474c
Returned: 200 - OK
#
Test 2 —  Valid format, but ID doesn't exist:
GET http://localhost:5000/api/products/111111111111111111111111
Returned: 404 - Product not found
#
Test 3 — Invalid format:
GET http://localhost:5000/api/products/banana
Returned: 400 - Invalid ID format'
*/

// Route Update / PUT (/api/books/:id) for 1 single product document
router.put('/:id', async (req, res) => {   // creates a PUT route...
  try {                                  //...while gracefully handling errors....
    const updatedProduct = await Product.findByIdAndUpdate(  //...where IF it 'finds' ....
      req.params.id,  //...the 'Product' model by id successfully...
      req.body,      // ...THEN it replaces its data with what the client sent..
      //{ new: true, runValidators: true}  // ...and then returns the updated version, not the old one... 
      { returnDocument: 'after', runValidators: true }
      //{returnDocument: 'after'}
    );
    if (!updatedProduct) { // however IF the 'updatedBook'...
      return res.status(404).json({ message: 'Product not found' }); //...THEN  404 error code is generated...
    }
    res.status(200).json(updatedProduct);  //...ELSE IF 'updatedProduct' is valid THEN  200  code is generated...
  } catch (error) {  //ELSE....
    res.status(400).json({ message: error.message });  // 400  error code is generated
  }
});

/*
Testing parameters:
Method: PUT
Body: raw > JSON
{
    "price": 159.99,
    "inStock": true
}
#
Test 1 — Successful product update:
http://localhost:5000/api/products/69c09ec02259995c462a474c
Returned: 200 - OK
#
Test 2 — Product not found:
http://localhost:5000/api/products/111111111111111111111111
Returned: 404 - Product not found
#
Test 3 — Validation:
{
    "price": -10
}
http://localhost:5000/api/products/69c09ec02259995c462a474c
Returned: 400 - Validation failed: price: Price must be greater than 0
*/


// Route DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'No product found with this id!' });
    }
    res.status(200).json({ message: 'Product deleted!' });
  } catch {
    //res.status(400).json(err);
    res.status(400).json({ message: 'Invalid ID format'});
  }
});
/*
Testing parameters:
Method: DELETE
Body: raw > JSON
#
Test 1 — Successful product delete:
http://localhost:5000/api/products/69c09ec02259995c462a474c
Returned: 200 - Product deleted!
#
Test 2 — Product not found:
http://localhost:5000/api/products/111111111111111111111111
Returned: 404 - No product found with this id!
#
Test 3 — Invalid format:
http://localhost:5000/api/products/banana
Returned: 400 - Invalid ID format
*/


// Route GET /api/products/ - fetch ALL products
router.get('/', async (req, res) => { // creates a GET route...
  //const allProducts = await Product.find()
  //console.log('Found product:', allProducts )
  try{      //...while gracefully handling errors...
     const allProducts = await Product.find(); //...where IF it 'finds' the 'Product' MODEL successfully..
      if (!allProducts) {      //...BUT NOT one product is valid/found..
            return res.status(404).json({ message: 'Products not found' }); //...it returns a 404 error code (404 = 'Products not found') 
        }
        res.status(200).json(allProducts); //...ELSE IF products valid/found, it returns a 200 code (200 = OK) and lists ALL products found in the DB!!
    } catch{                         
        //res.status(400).json({ message: err.message });
        res.status(400).json({ message: 'Invalid Request' })  //...ELSE returns a 400 error code (400 = 'Invalid Request') 

  }
})






/*

*/










// Ib)
module.exports = router; // exports router so 'server.js' can use it




///////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
Task 4: API Routes and Logic
In routes/productRoutes.js, use express.Router() to define your API endpoints. The logic for each route should be handled directly within the route file for this assessment.
Implement the following endpoints. All endpoints must handle potential errors with try...catch blocks and return appropriate status codes and JSON responses.
1.	POST /api/products (Create a Product)
o	Creates a new product based on the req.body.
o	Responds with the newly created product and a 201 status code.
o	If validation fails, it should return a 400 status code with a descriptive error message.

2.	GET /api/products/:id (Read a Single Product)
o	Retrieves a single product by its _id.
o	If the product is found, responds with the product object.
o	If no product is found, responds with a 404 status code.

3.	PUT /api/products/:id (Update a Product)
o	Updates a product by its _id with the data from req.body.
o	Responds with the updated product data (use the { new: true } option).
o	If no product is found to update, responds with a 404 status code.

4.	DELETE /api/products/:id (Delete a Product)
o	Deletes a product by its _id.
o	If successful, responds with a success message.
o	If no product is found to delete, responds with a 404 status code.

5.	GET /api/products (Read All Products with Advanced Querying)
o	This is the most complex endpoint. It should retrieve all products but also support the following optional query parameters: 
	category: Filter products by a specific category.
	minPrice: Filter products with a price greater than or equal to this value.
	maxPrice: Filter products with a price less than or equal to this value.
	sortBy: Sort results. For example, price_asc for ascending price or price_desc for descending price.
	page & limit: For pagination (defaulting to page 1, limit 10).
o	Dynamically build the Mongoose query based on which query parameters are provided.
o	Respond with an array of the resulting products.


*/