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
http://localhost:5000/api/products/69c09ec02259995c462a474c
Returned: 200 - OK
#
Test 2 —  Valid format, but ID doesn't exist:
http://localhost:5000/api/products/111111111111111111111111
Returned: 404 - Product not found
#
Test 3 — Invalid format:
http://localhost:5000/api/products/banana
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


// Route GET /api/products - Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => { //this line registers a GET handler on /api/products.

    try {
         const { category, minPrice, maxPrice, sortBy, page, limit } = req.query; // it makes quiries like "/api/products?category=shoes&minPrice=10&page=2" possible

         //1)----- FILTERING ------
         const filter = {}; //this filters by matching everything.
        if (category) filter.category = category; // if a category value is provided/valid, this adds it to the filter
        if (minPrice || maxPrice) { // If either 'minPrice' or 'maxPrice' exists...
            filter.price = {};  // create a price object on the filter.
            if (minPrice) filter.price.$gte = parseFloat(minPrice); // IF a minimum price was provided..
                                                                    // THEN convert it from a string to a number ("10" → 10)
                                                                    // AND  store it as the LOWEST allowed price
                                                                    // "hey, DONT gimme anything cheaper than teh current value"
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice); // IF a maximum price was provided..
                                                                    // THEN convert it from a string to a number ("10" → 10)
                                                                    // AND  store it as the HIGHEST allowed price
                                                                    // "hey, DONT gimme anything more expenisve than the current value"
        }
         // 2) ------ SORTING ----------
          const sort = {}; // builds an object
          if (sortBy === 'price_asc') sort.price = 1;   // sort results in 'ascending' order
          if (sortBy === 'price_desc') sort.price = -1; // sort results in 'descending' order

          // 3) --- PAGINATION ---
          const pageNum = parseInt(page) || 1; // 'page' value is the starting page number and comes from the URL's endpoint (ex, ?page=3). IF no page is provided, THEN it defaults to page 1
          const limitNum = parseInt(limit) || 10; // 'limit' value is the max results per page andcomes from the URL's endpoint (ex, ?limit=8). IF no page is provided, THEN it defaults to page 10 result sper page
          const skip = (pageNum - 1) * limitNum; // Page 1 skips 0 documents, page 2 skips 10 documents (from page 1), page 3 skips 20 documents (from pages 1,2), etc.
          const products = await Product.find(filter) // applies the filter
            .sort(sort) //sorts results
            .skip(skip) // skips to the correct page
            .limit(limitNum); // and limits the number of results returned.
        
        res.status(200).json(products); // IF everything checks out, it sends the matching products back in 'JSON' format with a '200 OK' status.
  
    } catch(err){
         res.status(500).json({ message: err.message }); // If anything goes worng, this sends a 500 Internal Server Error with the error message w/out crashing the server.
    }
})

/*
Testing parameters:
Method: GET - filtering, sorting, and pagination
Body: raw > JSON
#
Test 1 — Get ALL products (no filters):
http://localhost:5000/api/products
Returns: all 5 products
200 - OK
#
Test 2 — Filter by category:
http://localhost:5000/api/products?category=Electronics
Returns: 2 products (Wireless Headphones and Smart Watch)
200 - OK
#
Test 3 — Filter by price range:
http://localhost:5000/api/products?minPrice=50&maxPrice=150
Returns: 2 products (Wireless Headphones and Running Shoes)
200 - OK
#
Test 4 — Sort price ascending:
http://localhost:5000/api/products?sortBy=price_asc
Returns: Yoga Mat(29.99) > Coffee Maker(49.99) > Running Shoes(79.99) > Headphones(99.99) > Smart Watch(199.99)
200 - OK
#
Test 5 — Sort price descending:
http://localhost:5000/api/products?sortBy=price_desc
Returns: Smart Watch(199.99) > Headphones(99.99) > Running Shoes(79.99) > Coffee Maker(49.99) > Yoga Mat(29.99)
200 - OK
#
Test 6 — Pagination:
http://localhost:5000/api/products?page=1&limit=2
Returns: first 2 of 5 totals products only
200 - OK
#
Test 7 — Combine everything:
http://localhost:5000/api/products?category=Electronics&sortBy=price_asc&page=1&limit=2

*/


// Ib)
module.exports = router; // exports router so 'server.js' can use it




///////////////////////////////////////////////////////////////////////////////////////////////////////////


/* An attempt at task 5 - it fetch all products but without any filtering, sorting, and pagination
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
*/
